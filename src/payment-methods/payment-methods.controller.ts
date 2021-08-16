import { Body, Controller, Get, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { ReadPaymentMethodDto } from './dto/read-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodPaginationPipe } from './pipes/payment-method-pagination.pipe';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  async paginate(@Query(PaymentMethodPaginationPipe) options: any): Promise<PaginationResult<ReadPaymentMethodDto>> {
    return (await this.paymentMethodsService.paginate(options)).toClass(ReadPaymentMethodDto);
  }

  @Put(':code')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new ParamsToBodyInterceptor({code: 'code'}))
  async update(@Body() updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<ReadPaymentMethodDto> {
    return plainToClass(ReadPaymentMethodDto, await this.paymentMethodsService.update(updatePaymentMethodDto));
  }
}
