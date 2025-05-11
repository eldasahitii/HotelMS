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
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);


builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);


var jwtSecret = builder.Configuration["AppSettings:JwtSecretKey"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new Exception("JWT secret key is missing in appsettings.json!");
}
var jwtKeyBytes = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(jwtKeyBytes),
            ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 },
            RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
            NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        };
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("JWT authentication failed: " + context.Exception.ToString());
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

builder.Services.AddScoped<IHotelServiceService, HotelServiceService>();
builder.Services.AddScoped<IHotelServiceScheduleService, HotelServiceScheduleService>();
builder.Services.AddScoped<IHotelServiceReservationService, HotelServiceReservationService>();



//builder.Services.AddScoped<IRoomTypeService, RoomTypeService>();
builder.Services.AddControllers();

builder.Services.AddScoped<IAdminService, AdminService>();

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
