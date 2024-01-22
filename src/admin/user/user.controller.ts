import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from './dto/updateUser.dto';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { TokenDto } from '../token/dto/token.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('users')
@Controller('/admin/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    type: [UserEntity],
    description: 'Users returned successfully!',
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard)
  findUsers() {
    return this.userService.getAllUsers();
  }

  @ApiOkResponse({
    type: UserEntity,
    description: 'Current user returned successfully!',
  })
  @ApiBearerAuth()
  @Get('/get-me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() currentUser: TokenDto) {
    return this.userService.getUserByToken(currentUser);
  }

  @ApiOkResponse({
    type: UserEntity,
    description: 'User by id found',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id')
  @UseGuards(AuthGuard)
  findOneUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.findUserById(userId);
  }

  @ApiOkResponse({
    type: UserEntity,
    description: 'User by id found',
  })
  @ApiBearerAuth()
  @ApiBody({ type: UserUpdateDto, description: 'Data to update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Patch(':id')
  @UseGuards(AuthGuard)
  updateUser(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.updateUserById(userId, userUpdateDto);
  }

  @ApiOkResponse({
    description: 'User by id deleted',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID' })
  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteUser(@Param('id', ParseUUIDPipe) userId: string) {
    return this.userService.deleteUserById(userId);
  }
}
