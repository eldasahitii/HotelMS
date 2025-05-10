using HotelMS;
using HotelMS.Data;
using Microsoft.EntityFrameworkCore;
using HotelMS.Services;
using Microsoft.AspNetCore.Identity;
using HotelMS.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using HotelMS.Data.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JwtSecretKey"]!)), 
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 } 
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("JWT authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});


builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});


builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);


builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserServices, UserService>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<ICleaningStaffService, CleaningStaffService>();
builder.Services.AddScoped<ICleaningAssignmentService, CleaningAssignmentService>();
builder.Services.AddScoped<IRoomStatusService, RoomStatusService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IRestaurantTableService, RestaurantTableService>();
builder.Services.AddScoped<IRestaurantReservationService, RestaurantReservationService>();
builder.Services.AddTransient<Seed>();


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
            Array.Empty<string>()
        }
    });
});


var app = builder.Build();


if (args.Length == 1 && args[0].ToLower() == "seeddata")
    SeedData(app);

void SeedData(IHost app)
{
    using var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
    var service = scope.ServiceProvider.GetRequiredService<Seed>();
    service.SeedDataContext();
}


app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
