import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Service } from '../services/entities/service.entity';
import { Warranty } from '../warranties/entities/warranty.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../../commons/enums/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
    @InjectRepository(Warranty) private warrantyRepo: Repository<Warranty>,
    @InjectRepository(User) private readonly userRepo: Repository<User>, // Add this
    private readonly usersService: UsersService, // Add this
  ) {}

  async onModuleInit() {
    this.logger.log('Starting database seeding...');
    await this.seedCategories();
    await this.seedServices();
    await this.seedWarranties();
    await this.seedAdminUser(); // Add this line
    this.logger.log('Database seeding completed.');
  }

  private async seedCategories() {
    const categories = [
      { id: 1, name: 'Mineur' },
      { id: 2, name: 'Adulte' },
    ];

    for (const category of categories) {
      const exists = await this.categoryRepo.findOne({
        where: { id: category.id },
      });
      if (!exists) {
        await this.categoryRepo.save(category);
        this.logger.log(`Inserted category: ${category.name}`);
      }
    }
  }

  private async seedServices() {
    const services = [
      { id: 1, name: 'Honoraires médicaux', categoryId: 1, coverageRate: 100 },
      { id: 2, name: 'Honoraires médicaux', categoryId: 2, coverageRate: 100 },
      { id: 3, name: 'Pharmacie', categoryId: 1, coverageRate: 100 },
      { id: 4, name: 'Pharmacie', categoryId: 2, coverageRate: 100 },
      { id: 5, name: 'Analyses', categoryId: 1, coverageRate: 100 },
      { id: 6, name: 'Analyses', categoryId: 2, coverageRate: 100 },
      { id: 7, name: 'Radios', categoryId: 1, coverageRate: 100 },
      { id: 8, name: 'Radios', categoryId: 2, coverageRate: 100 },
      { id: 9, name: 'Soins dentaires', categoryId: 1, coverageRate: 100 },
      { id: 10, name: 'Soins dentaires', categoryId: 2, coverageRate: 100 },
      { id: 11, name: 'Optique', categoryId: 1, coverageRate: 100 },
      { id: 12, name: 'Optique', categoryId: 2, coverageRate: 100 },
      { id: 13, name: 'Hospitalisation', categoryId: 1, coverageRate: 100 },
      { id: 14, name: 'Hospitalisation', categoryId: 2, coverageRate: 100 },
    ];

    for (const service of services) {
      const exists = await this.serviceRepo.findOne({
        where: { id: service.id },
      });
      if (!exists) {
        await this.serviceRepo.save(service);
        this.logger.log(`Inserted service: ${service.name}`);
      }
    }
  }

  private async seedWarranties() {
    const warranties = [
      {
        name: 'Consultation généraliste',
        coverageRate: 100,
        limit: 8000,
        limitType: 'per act',
        serviceId: 1,
        categoryId: 1,
      },
      {
        name: 'Consultation Spécialiste',
        coverageRate: 100,
        limit: 10000,
        limitType: 'per act',
        serviceId: 1,
        categoryId: 1,
      },
      {
        name: 'Visite Généraliste',
        coverageRate: 100,
        limit: 8000,
        limitType: 'per act',
        serviceId: 1,
        categoryId: 1,
      },
      {
        name: 'Visite Spécialiste',
        coverageRate: 100,
        limit: 10000,
        limitType: 'per act',
        serviceId: 1,
        categoryId: 1,
      },
      {
        name: 'Soins infirmiers (AMI-SF)',
        coverageRate: 100,
        limit: 1000,
        limitType: 'per act',
        serviceId: 1,
        categoryId: 1,
      },
      {
        name: 'Plafond annuel',
        coverageRate: 100,
        limit: 200000,
        limitType: 'per year',
        serviceId: 1,
        categoryId: 1,
      },

      {
        name: 'Consultation généraliste',
        coverageRate: 100,
        limit: 8000,
        limitType: 'per act',
        serviceId: 2,
        categoryId: 2,
      },
      {
        name: 'Consultation Spécialiste',
        coverageRate: 100,
        limit: 10000,
        limitType: 'per act',
        serviceId: 2,
        categoryId: 2,
      },
      {
        name: 'Visite Généraliste',
        coverageRate: 100,
        limit: 8000,
        limitType: 'per act',
        serviceId: 2,
        categoryId: 2,
      },
      {
        name: 'Visite Spécialiste',
        coverageRate: 100,
        limit: 10000,
        limitType: 'per act',
        serviceId: 2,
        categoryId: 2,
      },
      {
        name: 'Soins infirmiers (AMI-SF)',
        coverageRate: 100,
        limit: 1000,
        limitType: 'per act',
        serviceId: 2,
        categoryId: 2,
      },
      {
        name: 'Plafond annuel',
        coverageRate: 100,
        limit: 200000,
        limitType: 'per year',
        serviceId: 2,
        categoryId: 2,
      },
    ];

    for (const warranty of warranties) {
      const exists = await this.warrantyRepo.findOne({
        where: { name: warranty.name, service: { id: warranty.serviceId } },
      });
      if (!exists) {
        await this.warrantyRepo.save(warranty);
        this.logger.log(`Inserted warranty: ${warranty.name}`);
      }
    }
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@example.com';
    const adminExists = await this.userRepo.findOne({
      where: { email: adminEmail },
    });

    if (adminExists) {
      this.logger.log(`Admin user with email ${adminEmail} already exists.`);
      return;
    }

    const adminDetails: Parameters<UsersService['createUser']>[0] = {
      name: 'Default Admin',
      email: adminEmail,
      password: 'SecurePassword123!', // Ensure this meets any password complexity rules if they exist
      phone: '70000000', // Example Malian phone number
      role: Role.Admin,
    };

    try {
      const newAdmin = await this.usersService.createUser(adminDetails);
      this.logger.log(`Successfully created admin user: ${newAdmin.email}`);
    } catch (error) {
      // Check if the error is a ConflictException from usersService.createUser
      // (though findOne should prevent this for email, createUser might check other fields or have other issues)
      if (error.name === 'ConflictException') {
        this.logger.warn(
          `Conflict while trying to create admin user ${adminEmail}. It might have been created in a parallel process or there's another conflict: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Error creating admin user ${adminEmail}: ${error.message}`,
          error.stack,
        );
      }
    }
  }
}
