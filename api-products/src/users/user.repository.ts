import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Repository for User entity data access operations
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Find a user by email
   * @param email - User email
   * @returns Promise with user or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  /**
   * Create and save a new user with hashed password
   * @param createUserDto - User creation data
   * @returns Promise with created user
   */
  async createAndSave(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);
    
    const user = this.repository.create({
      email: createUserDto.email,
      passwordHash,
    });
    
    return this.repository.save(user);
  }
}
