import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { RateProductDto } from './dto/rate-product.dto';
import { ProductRating } from './entities/product-rating.entity';
import { ProductRatingsService } from './product-ratings.service';

@Controller('product-ratings')
export class ProductRatingsController {
  constructor(private readonly productRatingsService: ProductRatingsService) {}

  @Post(':productId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ productId: 'productId' }))
  async rateProduct(@Body() rateProductDto: RateProductDto): Promise<ProductRating> {
    return await this.productRatingsService.rateProduct(rateProductDto);
  }
}
