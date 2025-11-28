import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Service for authentication operations
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new user
   * @param createUserDto - User registration data
   * @returns Promise with created user
   */
  async register(createUserDto: CreateUserDto) {
    return this.usersService.registerUser(createUserDto);
  }

  /**
   * Login user and generate JWT token
   * @param loginDto - Login credentials
   * @returns Promise with access token
   */
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.validateCredentials(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * Validate user for JWT strategy
   * @param email - User email
   * @returns Promise with user or null
   */
  async validateUser(email: string) {
    return this.usersService.findByEmail(email);
  }
}
