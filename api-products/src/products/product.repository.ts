import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

/**
 * Repository for Product entity data access operations
 */
@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  /**
   * Find all products
   * @returns Promise with array of products
   */
  async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  /**
   * Find a product by ID
   * @param id - Product ID
   * @returns Promise with product or null if not found
   */
  async findById(id: string): Promise<Product | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Create a new product
   * @param createProductDto - Product creation data
   * @returns Promise with created product
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.repository.create(createProductDto);
    return this.repository.save(product);
  }

  /**
   * Update an existing product
   * @param id - Product ID
   * @param updateProductDto - Product update data
   * @returns Promise with updated product or null if not found
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    await this.repository.update(id, updateProductDto);
    return this.findById(id);
  }

  /**
   * Remove a product by ID
   * @param id - Product ID
   * @returns Promise with deletion result
   */
  async remove(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
