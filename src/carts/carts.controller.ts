import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import queryStringToBoolean from 'src/support/query-string-to-boolean';
import { Role } from 'src/users/enums/roles.enum';
import { CartsService } from './carts.service';
import { AddShowToCartDto } from './dto/add-show-to-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { DeleteCartitemDto } from './dto/delete-cart-item.dto';
import { ReadCartDto } from './dto/read-cart.dto';
import { UpdateCartDiscountDto } from './dto/update-cart-discount.dto';
import { UpdateCartItemQuantityDto } from './dto/update-cart-item-quantity.dto';
import { CartItem } from './entities/cart-item.entity';
import { CartPaginationPipe } from './pipes/cart-pagination.pipe';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsRepository: CartsService) {}

  @Get('')
  @Roles(Role.CLIENT, Role.STORE, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async paginate(
    @Query(CartPaginationPipe) options: any,
    @Body('userId') userId: number
  ): Promise<PaginationResult<ReadCartDto>> {
    return (await this.cartsRepository.paginate(options, userId)).toClass(ReadCartDto);
  }

  @Post('add-to-cart')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async addToCart(@Body() addToCartDto: AddToCartDto): Promise<ReadCartDto> {
    return plainToClass(ReadCartDto, await this.cartsRepository.addToCart(addToCartDto));
  }

  @Post('add-show-to-cart')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async addShowToCart(@Body() addShowToCartDto: AddShowToCartDto): Promise<ReadCartDto> {
    return plainToClass(ReadCartDto, await this.cartsRepository.addShowToCart(addShowToCartDto));
  }

  @Put(':id/update-discount')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({id: 'id'}))
  async updateCartDiscount(@Body() updateCartDiscountDto: UpdateCartDiscountDto): Promise<ReadCartDto> {
    return plainToClass(ReadCartDto, await this.cartsRepository.updateCartDiscount(updateCartDiscountDto));
  }

  @Get('stores/:storeId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOneByStoreId(
    @Param('storeId') storeId: string,
    @Body('userId') userId: number,
    @Query('isExpired') isExpired: string,
    @Query('isProcessed') isProcessed: string
  ): Promise<ReadCartDto> {
    return plainToClass(ReadCartDto, await this.cartsRepository.findOneStoreId(userId, +storeId, {
      isExpired: queryStringToBoolean(isExpired),
      isProcessed: queryStringToBoolean(isProcessed),
    }));
  }

  @Get(':id')
  async findOneById(
    @Param('id') id: string,
    @Query('isExpired') isExpired: string,
    @Query('isProcessed') isProcessed: string
  ): Promise<ReadCartDto> {
    return plainToClass(ReadCartDto, await this.cartsRepository.findOneById(+id, {
      isExpired: queryStringToBoolean(isExpired),
      isProcessed: queryStringToBoolean(isProcessed),
    }));
  }

  @Delete(':cartId/cart-items/:cartItemId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({cartId: 'cartId', cartItemId: 'cartItemId'}))
  async deleteCartItem(@Body() deleteCartItemDto: DeleteCartitemDto): Promise<ReadCartDto> {
    return plainToClass(ReadCartDto, await this.cartsRepository.deleteCartItem(deleteCartItemDto));
  }

  @Put(':cartId/cart-items/:cartItemId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({cartId: 'cartId', cartItemId: 'cartItemId'}))
  async udpateCartItemQuantity(@Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto): Promise<CartItem> {
    return await this.cartsRepository.updateCartItemQuantity(updateCartItemQuantityDto);
  }

  @Delete(':cartId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async delete(
    @Param('cartId') cartId: string,
    @Body('userId') userId: number
  ): Promise<void> {
    await this.cartsRepository.delete({cartId: +cartId, userId});
  }
}
