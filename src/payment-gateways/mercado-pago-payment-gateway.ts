import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mercadopago from "mercadopago";
import { CreatePreferencePayload, PreferenceItem } from "mercadopago/models/preferences/create-payload.model";
import { Order } from "src/orders/entities/order.entity";

@Injectable()
export class MercadoPagoPaymentGateway {
  constructor(private readonly configService: ConfigService) {
    mercadopago.configure({
      access_token: this.config.accessToken,
    });
  }

  get config() {
    return {
      useTestUser: this.configService.get('MP_USE_TEST_USER') === 'true',
      testUser: this.configService.get<string>('MP_TEST_USER'),
      accessToken: this.configService.get<string>('MP_ACCESS_TOKEN'),
    };
  }

  async getPaymentUrl(order: Order): Promise<string> {
    const items: PreferenceItem[] = order.cart.cartItems.map(item => ({
      title: item.productName,
      unit_price: +item.productPrice,
      quantity: +item.quantity,
      picture_url: item.productImage,
    }));

    const frontEndUrl = this.configService.get('CLIENT_FRONTEND_URL', 'http://localhost:3000');

    const preferences: CreatePreferencePayload = {
      items,
      payer: {
        name: order.user.client.name,
        email: this.config.useTestUser ? this.config.testUser : order.user.email,
      },
      payment_methods: {
        installments: 1,
      },
      back_urls: {
        success: `${frontEndUrl}/orders?mercadopago-status=success`,
        failure: `${frontEndUrl}/orders?mercadopago-status=failure`,
        pending: `${frontEndUrl}/orders?mercadopago-status=pending`,
      },
      auto_return: 'all',
      shipments: {
        cost: order?.delivery?.total,
      },
      external_reference: `REF${order.id}`,
      notification_url: `${this.configService.get('BACKEND_URL', 'http://localhost:3000')}/orders/ipn`,
    }

    const res = await mercadopago.preferences.create(preferences);

    return res.body.init_point;
  }
}
