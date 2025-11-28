import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductRepository;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    isPremium: true,
    price: 25.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProductRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct];
      mockProductRepository.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');

      expect(result).toEqual(mockProduct);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create and return a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        isPremium: true,
        price: 25.5,
      };
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto);

      expect(result).toEqual(mockProduct);
      expect(repository.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };
      const updatedProduct = { ...mockProduct, name: 'Updated Product' };
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      const result = await service.update('1', updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(repository.update).toHaveBeenCalledWith('1', updateProductDto);
    });

    it('should throw NotFoundException when product not found', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
      };
      mockProductRepository.update.mockResolvedValue(null);

      await expect(service.update('1', updateProductDto)).rejects.toThrow(NotFoundException);
      expect(repository.update).toHaveBeenCalledWith('1', updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockProductRepository.remove.mockResolvedValue(true);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when product not found', async () => {
      mockProductRepository.remove.mockResolvedValue(false);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
      expect(repository.remove).toHaveBeenCalledWith('1');
    });
  });
});
