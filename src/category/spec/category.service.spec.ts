import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { ImageSharpFileConverter } from 'src/helpers/pipes/imageTransform.pipe';
import { VideoFileConverter } from 'src/helpers/pipes/videoTransform.pipe';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../category.service';
import { MediaEntity } from 'src/helpers/entities/media.entity';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let mediaRepository: Repository<MediaEntity>;
  let minioService: MinioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        ImageSharpFileConverter,
        VideoFileConverter,
        {
          provide: getRepositoryToken(CategoryEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MediaEntity),
          useClass: Repository,
        },
        {
          provide: MinioService,
          useValue: {
            deleteFile: jest.fn(),
            deleteFiles: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
    mediaRepository = module.get<Repository<MediaEntity>>(
      getRepositoryToken(MediaEntity),
    );
    minioService = module.get<MinioService>(MinioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Write more tests for each method in the CategoryService

  it('should throw NotFoundException when trying to find a non-existing category', async () => {
    const findOneSpy = jest
      .spyOn(categoryRepository, 'findOne')
      .mockResolvedValueOnce(undefined);

    await expect(service.findOneCategory('nonexistentId')).rejects.toThrowError(
      NotFoundException,
    );

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { id: 'nonexistentId' },
    });
  });

  it('should throw ConflictException when a duplicate title is found', async () => {
    const checkDuplicateTitleSpy = jest
      .spyOn(service, 'checkDuplicateTitle')
      .mockRejectedValueOnce(new ConflictException());

    await expect(
      service.createCategory({
        tkmTitle: 'DuplicateTitle',
        ruTitle: 'UniqueTitle',
        enTitle: 'UniqueTitle',
      }),
    ).rejects.toThrowError(ConflictException);

    expect(checkDuplicateTitleSpy).toHaveBeenCalledWith(
      'DuplicateTitle',
      'tkmTitle',
    );
  });

  // Add more tests for other methods in the CategoryService

  afterEach(() => {
    jest.clearAllMocks();
  });
});
