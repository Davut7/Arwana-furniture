import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserUpdateDto } from './dto/updateUser.dto';
import { TokenDto } from '../token/dto/token.dto';
import { hash } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    const [users, count] = await this.userRepository.findAndCount({
      select: ['id', 'name', 'updatedAt', 'updatedAt'],
    });

    return {
      message: 'User returned successfully',
      users: users,
      userCount: count,
    };
  }

  async findUserById(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'name', 'createdAt', 'updatedAt'],
    });
    if (!user) throw new NotFoundException(`User with id ${userId} not found`);
    return {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateUserById(userId: string, userUpdateDto: UserUpdateDto) {
    const user = await this.findUserById(userId);
    if (userUpdateDto.password) {
      const hashedPassword = await hash(userUpdateDto.password, 10);
      userUpdateDto.password = hashedPassword;
    }
    Object.assign(user, userUpdateDto);

    await this.userRepository.save(user);
    return {
      message: 'User updated successfully!',
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUserById(userId: string) {
    const user = await this.findUserById(userId);

    await this.userRepository.delete(user.id);
    return {
      message: 'User deleted successfully!',
    };
  }

  async getUserByToken(currentUser: TokenDto) {
    const user = await this.findUserById(currentUser.id);

    return user as TokenDto;
  }
}
