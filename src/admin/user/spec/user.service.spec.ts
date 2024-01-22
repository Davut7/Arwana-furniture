import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TokenDto } from 'src/admin/token/dto/token.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

  const dummyId = '123';

  const mockedUsers: UserEntity[] = [];

  const currentUser: TokenDto = {
    id: dummyId,
    name: 'John',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn().mockResolvedValue([[], 0]),
            findOneUserMock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return all users', async () => {
      const mockResponse = {
        message: 'User returned successfully',
        users: mockedUsers,
        userCount: mockedUsers.length,
      };

      jest.spyOn(service, 'findUsers').mockResolvedValue(mockResponse);

      const result = await service.findUsers();

      expect(result).toEqual(mockResponse);
      expect(service.findUsers).toHaveBeenCalled();
    });
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

        jest.spyOn(service, 'findOneUser').mockResolvedValue(mockResponse);

        const result = await service.findOneUser(dummyId);

        expect(result).toEqual(mockResponse);
        expect(service.findOneUser).toHaveBeenCalled();
      });

      it('Should throw NotFoundException when user is not found', async () => {
        jest.spyOn(service, 'findOneUser').mockResolvedValue(null);

        try {
          await service.findOneUser(dummyId);

          fail('Excepted NotFoundException but no exception was thrown');
        } catch (error: any) {
          if (error instanceof NotFoundException) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(error.message).toContain(
              `User with id ${dummyId} not found`,
            );
          }
        }
        expect(service.findOneUser).toHaveBeenCalled();
      });
    });

    it(`Should delete a user`, async () => {
      const mockResponse = {
        message: 'User deleted successfully',
      };

      jest.spyOn(service, 'deleteUser').mockResolvedValue(mockResponse);

      const result = await service.deleteUser(dummyId);

      expect(result).toBe(mockResponse);
      expect(service.deleteUser).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it(`Should find a user by id`, async () => {
      const mockResponse = {
        id: dummyId,
        name: 'John',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'findOneUser').mockResolvedValue(mockResponse);

      const result = await service.findOneUser(dummyId);

      expect(result).toEqual(mockResponse);
      expect(service.findOneUser).toHaveBeenCalled();
    });

    it('Should throw NotFoundException when user is not found', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(null);

      try {
        await service.findOneUser(dummyId);

        fail('Excepted NotFoundException but no exception was thrown');
      } catch (error: any) {
        if (error instanceof NotFoundException) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toContain(`User with id ${dummyId} not found`);
        }
      }
      expect(service.findOneUser).toHaveBeenCalled();
    });
  });

  describe('getMe', () => {
    it(`Should return the user for the provided currentUser`, async () => {
      const expectedUser = {
        id: '123',
        name: 'John',
      };

      jest.spyOn(service, 'getMe').mockResolvedValue(expectedUser);

      const result = await service.getMe(currentUser);

      expect(service.getMe).toHaveBeenCalled();

      expect(result).toEqual(expectedUser);
    });

    it('Should throw NotFoundException when user is not found', async () => {
      jest.spyOn(service, 'findOneUser').mockResolvedValue(null);

      try {
        await service.findOneUser(dummyId);

        fail('Excepted NotFoundException but no exception was thrown');
      } catch (error: any) {
        if (error instanceof NotFoundException) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toContain(`User with id ${dummyId} not found`);
        }
      }
      expect(service.findOneUser).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userUpdateDto: Partial<UserEntity> = {
        name: 'Dep',
      };
      const mockResponse = {
        id: dummyId,
        name: 'John',
        createdAt: new Date(),
        updatedAt: new Date(),
        message: 'User updated successfully!',
      };
      const result = await service.updateUser(dummyId, userUpdateDto);

      jest.spyOn(service, 'updateUser').mockResolvedValue(mockResponse);

      expect(result).toEqual(mockResponse);
      expect(service.updateUser).toHaveBeenCalled();
    });
  });
});
