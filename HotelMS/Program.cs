using HotelMS;
using HotelMS.Data;
using Microsoft.EntityFrameworkCore;
using HotelMS.Services;
using Microsoft.AspNetCore.Identity;
using HotelMS.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Razor.Language;
using HotelMS.Data.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = false,  // or set your Issuer here
            ValidateAudience = false,  // or set your Audience here
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JwtSecretKey"])),
        };
    });

// 2. Add CORS policy to allow any origin (optional)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});

// 3. Add DbContext (SQL Server)
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 4. Add controllers with JSON options (to handle circular references)
builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

// 5. Add Scoped Services (business logic layer)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserServices, UserService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<ICleaningStaffService, CleaningStaffService>();
builder.Services.AddScoped<ICleaningAssignmentService, CleaningAssignmentService>();
builder.Services.AddScoped<IRoomStatusService, RoomStatusService>();
builder.Services.AddTransient<Seed>();  // Seed service to add initial data if needed

// 6. Add Swagger for API documentation and authentication
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

// 7. Build the application
var app = builder.Build();

// 8. Check if we need to seed data (optional)
if (args.Length == 1 && args[0].ToLower() == "seeddata")
    SeedData(app);

void SeedData(IHost app)
{
    var scopedFactory = app.Services.GetService<IServiceScopeFactory>();
    using (var scope = scopedFactory.CreateScope())
    {
        var service = scope.ServiceProvider.GetRequiredService<Seed>();
        service.SeedDataContext();
    }
}

// 9. Apply CORS
app.UseCors("AllowAll");

// 10. Use authentication & authorization middleware
app.UseAuthentication();  // Important for JWT token validation
app.UseAuthorization();   // Important for checking roles and permissions

// 11. Configure the HTTP request pipeline for Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 12. Map API controllers
app.MapControllers();

// 13. Run the application
app.Run();
