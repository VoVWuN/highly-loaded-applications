import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any | null> {
    const user = await this.usersService.findByEmail(email);

    const passwordEquals = await argon2.verify(user.password, pass);

    if (user && passwordEquals) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(loginUserDto: LoginAuthDto) {
    const user = await this.usersService.findByEmail(loginUserDto.login);
    const token = this.createToken(user);

    return {
      ...token,
      data: user,
    };
  }

  async register(userDto: CreateUserDto) {
    const user = await this.usersService.create(userDto);
    return user;
  }

  private createToken(user: any) {
    const payload = { email: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}