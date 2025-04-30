using HotelMS;
using HotelMS.Data;
using Microsoft.EntityFrameworkCore;
using HotelMS.Interfaces;
using HotelMS.Services;
using Microsoft.AspNetCore.Identity;
using HotelMS.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Razor.Language;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

//Liranda
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<DataContext>();
    //L


//builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);
//builder.Services.AddIdentityCore<User>()
//    .AddEntityFrameworkStores<DataContext>()
//    .AddApiEndpoints();
builder.Services.AddControllers();

builder.Services.AddTransient<Seed>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<DataContext>(options=>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
}
);

//O
//builder.Services.AddIdentity<User, IdentityRole>(options =>
//{
 //   options.Password.RequireDigit = true;
   // options.Password.RequireLowercase = true;
    //options.Password.RequireUppercase = true;
    //options.Password.RequireNonAlphanumeric = true;
    //options.Password.RequiredLength = 8;
//})
  //  .AddEntityFrameworkStores<DataContext>();
//builder.Services.AddAuthentication(options =>
//{
  //  options.DefaultAuthenticateScheme =
   // options.DefaultChallengeScheme =
    //options.DefaultForbidScheme =
    //options.DefaultScheme =
    //options.DefaultSignInScheme =
    //options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme
//}).AddJwtBearer(options =>
//{
  //  options.TokenValidationParameters = new TokenValidationParameters
    //{
      //  ValidateIssuer = true,
       // ValidIssuer = builder.Configuration["JWT:Issure"],
        //ValidateAudience = true,
        //ValidAudience = builder.Configuration["JWT":Audience],
        //ValidateIssuerSigningKey = true,
        //IssuerSigningKey = new SymmetricSecurityKey(
          //  System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
            //)

//    };
//});
//O


builder.Services.AddScoped<IUserServices, UserServices>();

var app = builder.Build();

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //app.MapIdentityApi<User>();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//o
//app.UseAuthentication();
//app.UseAuthorization();
//o

app.MapIdentityApi<User>();

app.UseAuthorization();

app.MapControllers();

app.Run();
