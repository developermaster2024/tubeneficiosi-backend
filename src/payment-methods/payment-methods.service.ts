import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Repository } from 'typeorm';
import { PaymentMethodPaginationOptionsDto } from './dto/payment-method-pagination-options.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentMethods } from './enum/payment-methods.enum';
import { PaymentMethodNotFoundException } from './errors/payment-method-not-found.exception';

@Injectable()
export class PaymentMethodsService {
  constructor(@InjectRepository(PaymentMethod) private readonly paymentMethodsRepository: Repository<PaymentMethod>) {}

  async paginate({offset, perPage, filters: {
    codes,
    name,
    usesBankAccounts,
  }}: PaymentMethodPaginationOptionsDto): Promise<PaginationResult<PaymentMethod>> {
    const queryBuilder = this.paymentMethodsRepository.createQueryBuilder('paymentMethod')
      .leftJoinAndSelect('paymentMethod.bankAccounts', 'bankAccount')
      .leftJoinAndSelect('bankAccount.cardIssuer', 'cardIssuer')
      .take(perPage)
      .skip(offset);

    if (codes.length > 0) queryBuilder.andWhere('paymentMethod.code IN (:...codes)', { codes });

    if (name) queryBuilder.andWhere('paymentMethod.name LIKE :name', { name: `%${name}%` });

    if (usesBankAccounts !== null) queryBuilder.andWhere('paymentMethod.usesBankAccounts = :usesBankAccounts', { usesBankAccounts: +usesBankAccounts });

    const [paymentMethods, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(paymentMethods, total, perPage);
  }

  async findOneByCode(code: PaymentMethods): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodsRepository.findOne({ code });

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException();
    }

    return paymentMethod;
  }

  async update({ code, image }: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = await this.findOneByCode(code);

    if (image) {
      paymentMethod.imgPath = image.path;
    }

    return await this.paymentMethodsRepository.save(paymentMethod);
  }
}
