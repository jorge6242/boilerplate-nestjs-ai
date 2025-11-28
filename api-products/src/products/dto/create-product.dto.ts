import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsNumber, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new product
 */
export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Café Premium' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Product description', example: 'Premium coffee blend' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Whether the product is premium', example: true })
  @IsBoolean()
  isPremium: boolean;

  @ApiPropertyOptional({ description: 'Product price (required if isPremium is true)', example: 25.5 })
  @ValidateIf(o => o.isPremium === true)
  @IsNumber()
  price?: number;
}
