import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

/**
 * Service for managing products using database persistence
 */
@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Retrieves all products
   * @returns Promise with array of all products
   */
  async findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  /**
   * Finds a product by ID
   * @param id - Product ID
   * @returns Promise with the found product
   * @throws NotFoundException when product is not found
   */
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Creates a new product
   * @param createProductDto - Product creation data
   * @returns Promise with the created product
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  /**
   * Updates an existing product
   * @param id - Product ID
   * @param updateProductDto - Product update data
   * @returns Promise with the updated product
   * @throws NotFoundException when product is not found
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Removes a product by ID
   * @param id - Product ID
   * @throws NotFoundException when product is not found
   */
  async remove(id: string): Promise<void> {
    const deleted = await this.productRepository.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
