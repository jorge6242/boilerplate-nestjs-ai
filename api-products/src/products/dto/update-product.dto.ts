import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO for updating an existing product
 * All fields from CreateProductDto are optional
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
