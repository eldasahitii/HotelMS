using HotelMS.Data.DTO;
using HotelMS.Data;
using HotelMS.Models;
using HotelMS.Data.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelMS.Services
{
    public class ServiceStatusService : IServiceStatusService
    {
        private readonly DataContext _dbContext;

        public ServiceStatusService(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ServiceStatus> AddServiceStatus(ServiceStatusDTO request)
        {
            try
            {
                ServiceStatus serviceStatus = new ServiceStatus
                {
                    ServiceStatusName = request.ServiceStatusName
                };

                _dbContext.ServiceStatuses.Add(serviceStatus);
                await _dbContext.SaveChangesAsync();

                return serviceStatus;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to save the service status record.");
            }
        }

        public async Task<ServiceStatus> GetServiceStatus(int id)
        {
            try
            {
                var result = await _dbContext.ServiceStatuses.FindAsync(id);
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching the service status.");
            }
        }

        public async Task<IEnumerable<ServiceStatus>> GetAllServiceStatus()
        {
            try
            {
                var result = await _dbContext.ServiceStatuses.ToListAsync();
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching service statuses.");
            }
        }

        public async Task<ServiceStatus> UpdateServiceStatus(int id, ServiceStatusDTO request)
        {
            try
            {
                var serviceStatus = await _dbContext.ServiceStatuses.FindAsync(id);

                if (serviceStatus == null)
                {
                    return null;
                }

                serviceStatus.ServiceStatusName = request.ServiceStatusName;
                await _dbContext.SaveChangesAsync();

                return serviceStatus;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to update the service status.");
            }
        }

        public async Task DeleteServiceStatus(int id)
        {
            try
            {
                var serviceStatus = await _dbContext.ServiceStatuses.FindAsync(id);
                if (serviceStatus != null)
                {
                    _dbContext.ServiceStatuses.Remove(serviceStatus);
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while attempting to delete the service status.");
            }
        }
    }
}
