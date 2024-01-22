import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { TokenService } from '../../token/token.service';
import { TokenEntity } from '../../token/entities/token.entity';
import { TokenDto } from '../../token/dto/token.dto';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const dummyId = '12312321';

  const userUpdateDto: Partial<UserEntity> = {
    name: 'Dep',
  };

  const currentUser: TokenDto = {
    id: dummyId,
    name: 'John',
  };

  const mockUseRepository = {
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    getMe: jest.fn(),
    findUsers: jest.fn(),
    findOne: jest.fn(),
  };

  const mockUsers: UserEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUseRepository,
        },
        TokenService,
        {
          provide: getRepositoryToken(TokenEntity),
          useValue: TokenEntity,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return a status 200', async () => {
      const mockResponse = {
        message: 'Users returned successfully',
        users: mockUsers,
        userCount: mockUsers.length,
      };
      jest.spyOn(userService, 'findUsers').mockResolvedValue(mockResponse);

      const result = await controller.findUsers();

      expect(result).toEqual(mockResponse);
      expect(userService.findUsers).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a 200 status', async () => {
      const mockResponse = {
        id: dummyId,
        name: 'John',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findOneUser').mockResolvedValue(mockResponse);

      const result = await controller.findOneUser(dummyId);

      expect(result).toEqual(mockResponse);
      expect(userService.findOneUser).toHaveBeenCalled();
    });

    it('should return NotFoundException', async () => {
      jest.spyOn(userService, 'findOneUser');

      try {
        await userService.findOneUser(dummyId);
        expect(userService.findOneUser).toHaveBeenCalled();
      } catch (err) {
        if (err instanceof NotFoundException) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message);
        }
      }
    });
  });

  describe('deleteUser', () => {
    it('should return a 200 status', async () => {
      const mockResponse = {
        id: dummyId,
        name: 'John',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findOneUser').mockResolvedValue(mockResponse);

      const result = await controller.findOneUser(dummyId);

      expect(result).toEqual(mockResponse);
      expect(userService.findOneUser).toHaveBeenCalled();
    });

    it('should return NotFoundException', async () => {
      jest.spyOn(userService, 'findOneUser');

      try {
        await userService.findOneUser(dummyId);
        expect(userService.findOneUser).toHaveBeenCalled();
      } catch (err) {
        if (err instanceof NotFoundException) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message);
        }
      }
    });

    describe('deleteUser', () => {
      describe('findById', () => {
        it(`Should find a user by id`, async () => {
          const mockResponse = {
            id: dummyId,
            name: 'John',
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          jest
            .spyOn(userService, 'findOneUser')
            .mockResolvedValue(mockResponse);

          const result = await userService.findOneUser(dummyId);

          expect(result).toEqual(mockResponse);
          expect(userService.findOneUser).toHaveBeenCalled();
        });

        it('Should throw NotFoundException when user is not found', async () => {
          jest.spyOn(userService, 'findOneUser').mockResolvedValue(null);

          try {
            await userService.findOneUser(dummyId);

            fail('Excepted NotFoundException but no exception was thrown');
          } catch (error: any) {
            if (error instanceof NotFoundException) {
              expect(error).toBeInstanceOf(NotFoundException);
              expect(error.message).toContain(
                `User with id ${dummyId} not found`,
              );
            }
          }
          expect(userService.findOneUser).toHaveBeenCalled();
        });
      });

      it(`Should delete a user`, async () => {
        const mockResponse = {
          message: 'User deleted successfully',
        };

        jest.spyOn(userService, 'deleteUser').mockResolvedValue(mockResponse);

        const result = await userService.deleteUser(dummyId);

        expect(result).toBe(mockResponse);
        expect(userService.deleteUser).toHaveBeenCalled();
      });
    });
  });

  describe('getMe', () => {
    it(`Should return the user for the provided currentUser`, async () => {
      const expectedUser = {
        id: '123',
        name: 'John',
      };

      jest.spyOn(userService, 'getMe').mockResolvedValue(expectedUser);

      const result = await userService.getMe(currentUser);

      expect(userService.getMe).toHaveBeenCalled();

      expect(result).toEqual(expectedUser);
    });

    it('Should throw NotFoundException when user is not found', async () => {
      jest.spyOn(userService, 'findOneUser').mockResolvedValue(null);

      try {
        await userService.findOneUser(dummyId);

        fail('Excepted NotFoundException but no exception was thrown');
      } catch (error: any) {
        if (error instanceof NotFoundException) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toContain(`User with id ${dummyId} not found`);
        }
      }
      expect(userService.findOneUser).toHaveBeenCalled();
    });
  });

  // describe('updateUser', () => {
  //   it('should update user', async () => {
  //     const mockUser = {
  //       id: dummyId,
  //       name: 'John',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     jest.spyOn(userService, 'findOneUser').mockResolvedValue(mockUser);

  //     const mockResponse = {
  //       id: dummyId,
  //       name: 'Dep',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //       message: 'User updated successfully!',
  //     };
  //     jest.spyOn(userService, 'updateUser').mockResolvedValue(mockResponse);

  //     const result = await userService.updateUser(dummyId, userUpdateDto);

  //     expect(result).toBe(mockResponse);
  //     expect(userService.findOneUser).toHaveBeenCalledWith(dummyId);
  //     expect(userService.updateUser).toHaveBeenCalledWith(
  //       dummyId,
  //       userUpdateDto,
  //     );
  //   });

  //   it('Should throw NotFoundException when user is not found', async () => {
  //     jest.spyOn(userService, 'findOneUser').mockResolvedValue(null);

  //     try {
  //       await userService.findOneUser(dummyId);

  //       fail('Excepted NotFoundException but no exception was thrown');
  //     } catch (error: any) {
  //       if (error instanceof NotFoundException) {
  //         expect(error).toBeInstanceOf(NotFoundException);
  //         expect(error.message).toContain(`User with id ${dummyId} not found`);
  //       }
  //     }
  //     expect(userService.findOneUser).toHaveBeenCalled();
  //   });
  // });
});
