import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UserRepository;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
    createAndSave: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.createAndSave.mockResolvedValue(mockUser);

      const result = await service.registerUser(createUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(repository.createAndSave).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.registerUser(createUserDto)).rejects.toThrow(ConflictException);
      expect(repository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });
  });

  describe('validateCredentials', () => {
    it('should return user when credentials are valid', async () => {
      // Mock bcrypt.compare to return true
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateCredentials('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateCredentials('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    });

    it('should return null when password is invalid', async () => {
      // Mock bcrypt.compare to return false
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateCredentials('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});
