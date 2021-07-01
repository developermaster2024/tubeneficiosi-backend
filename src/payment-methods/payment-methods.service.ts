import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Like, Repository } from 'typeorm';
import { PaymentMethodPaginationOptionsDto } from './dto/payment-method-pagination-options.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethodNotFoundException } from './errors/payment-method-not-found.exception';

@Injectable()
export class PaymentMethodsService {
  constructor(@InjectRepository(PaymentMethod) private readonly paymentMethodsRepository: Repository<PaymentMethod>) {}

  async paginate({offset, perPage, filters}: PaymentMethodPaginationOptionsDto): Promise<PaginationResult<PaymentMethod>> {
    const where: FindConditions<PaymentMethod> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.name) where.name = Like(`%${filters.name}%`);

    // @ts-ignore
    if (filters.isActive) where.isActive = filters.isActive;

    const [paymentMethods, total] = await this.paymentMethodsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
    });

    return new PaginationResult(paymentMethods, total, perPage);
  }

  async findOne(id: number): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodsRepository.findOne(id);

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException();
    }

    return paymentMethod;
  }

  async update({id, image, ...updatePaymentMethodDto}: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = await this.findOne(+id);

    Object.assign(paymentMethod, updatePaymentMethodDto);

    if (image) {
      paymentMethod.imgPath = image.path;
    }

    return await this.paymentMethodsRepository.save(paymentMethod);
  }
}
