import { Module } from '@nestjs/common';
import { MercadoPagoPaymentGateway } from './mercado-pago-payment-gateway';

@Module({
  providers: [MercadoPagoPaymentGateway],
  exports: [MercadoPagoPaymentGateway]
})
export class PaymentGatewaysModule {}
