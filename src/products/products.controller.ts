import { Controller, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDTO } from 'src/shared/dto/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // @Post() // -> se pueden dejar los dos y que funcione como hibri
  @MessagePattern({ cmd: 'create_product' })
  create(createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(paginationDto: PaginationDTO) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_product' })
  findOne(id: string) {
    return this.productsService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(@Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id') id: number) {
    return this.productsService.remove(+id);
  }


  // validate products for orders
  @MessagePattern({ cmd: 'validate_products' })
  validateProducts(@Payload() productIds: number[]) {
    console.log('hola mundo');

    return this.productsService.validateProducts(productIds);
  }
}
