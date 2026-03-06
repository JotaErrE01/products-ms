import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient, Product } from 'generated/prisma/client';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';
import { IPaginationResponse } from 'src/shared/types/PaginationResponse.interface';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected 💽💽💽');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }

  async findAll(paginationDto: PaginationDTO): Promise<IPaginationResponse<Product>> {
    const { page = 1, limit = 10 } = paginationDto;

    const totalRows = await this.product.count();

    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { isDeleted: false },
    });

    return {
      meta: {
        totalItems: totalRows,
        currentPage: page,
        totalPages: Math.ceil(totalRows / limit),
      },
      data: products
    };

  }

  async findOne(id: number) {
    const product = await this.product.findUnique({ where: { id, isDeleted: false } });
    if (!product) throw new RpcException({
      message: `Product with ID ${id} not found`,
      status: HttpStatus.NOT_FOUND,
    });
    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...rest } = updateProductDto;
    const product = await this.findOne(id);
    return this.product.update({
      where: { id },
      data: { ...product, ...rest },
    });
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.product.update({ where: { id }, data: { ...product, isDeleted: true } });
  }


  async validateProducts(productIds: Array<number>) {
    const validIds = Array.from(new Set(productIds));
    const products = await this.product.findMany({ where: { id: { in: validIds }, isDeleted: false } });
    const foundIds = products.map(p => p.id);
    const invalidIds = validIds.filter(id => !foundIds.includes(id));
    if (invalidIds.length > 0) {
      throw new RpcException({
        message: `Invalid product IDs: ${invalidIds.join(', ')}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return products;
  }
}
