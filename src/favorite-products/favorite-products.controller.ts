import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { ToggleFavoriteProductDto } from './dto/toggle-favorite-product.dto';
import { FavoriteProductsService } from './favorite-products.service';

@Controller('favorite-products')
export class FavoriteProductsController {
  constructor(private readonly favoriteProductsService: FavoriteProductsService) {}

  @Post(':productId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({ productId: 'productId' }), new JwtUserToBodyInterceptor())
  async toggle(@Body() toggleFavoriteProductDto: ToggleFavoriteProductDto): Promise<boolean> {
    return await this.favoriteProductsService.toggle(toggleFavoriteProductDto);
  }
}
