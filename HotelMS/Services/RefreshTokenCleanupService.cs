using HotelMS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace HotelMS.Services
{
    public class RefreshTokenCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromDays(1); 

        public RefreshTokenCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<DataContext>();

                    var expiredUsers = await context.Users
                        .Where(u => u.RefreshTokenExpiry < DateTime.UtcNow)
                        .ToListAsync();

                    foreach (var user in expiredUsers)
                    {
                        user.RefreshToken = null;
                        user.RefreshTokenExpiry = null;
                    }

                    if (expiredUsers.Any())
                        await context.SaveChangesAsync();
                }

                await Task.Delay(_cleanupInterval, stoppingToken);
            }
        }
    }
}
