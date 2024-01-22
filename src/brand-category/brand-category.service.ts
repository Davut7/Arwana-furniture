import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryBrandEntity } from './entities/brandCategory.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { BrandsEntity } from 'src/brands/entities/brands.entity';

@Injectable()
export class BrandCategoryService {
  constructor(
    @InjectRepository(BrandsEntity)
    private readonly brandRepository: Repository<BrandsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(CategoryBrandEntity)
    private readonly categoryBrandRepository: Repository<CategoryBrandEntity>,
  ) {}

  async addBrandCategoryRelation(brandId: string, categoryId: string) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!brand || !category) {
      throw new Error('Brand or Category not found');
    }

    const existingRelation = await this.categoryBrandRepository.findOne({
      where: { brand: { id: brandId }, category: { id: categoryId } },
    });

    if (existingRelation) {
      throw new ConflictException(
        'This brand-category relation already exists',
      );
    }

    const categoryBrand = new CategoryBrandEntity();
    categoryBrand.brand = brand;
    categoryBrand.category = category;

    return this.categoryBrandRepository.save(categoryBrand);
  }

  async deleteCategoryBrand(brandId: string, categoryId: string) {
    const categoryBrand = await this.categoryBrandRepository.findOne({
      where: { brand: { id: brandId }, category: { id: categoryId } },
    });

    if (!categoryBrand) throw new NotFoundException(`This relation not found!`);

    await this.categoryBrandRepository.delete(categoryBrand.id);
    return {
      message: 'Brand category deleted successfully!',
    };
  }

  async findCategoryBrandById(brandCategoryId: string) {
    const categoryBrand = await this.categoryBrandRepository.findOne({
      where: { id: brandCategoryId },
    });
    if (!categoryBrand) throw new NotFoundException('CategoryBrand not found');
    return categoryBrand;
  }
}
