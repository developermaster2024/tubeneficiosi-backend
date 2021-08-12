import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { IsNull, Repository } from 'typeorm';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionPaginationOptionsDto } from './dto/question-pagination-options.dto';
import { Question } from './entities/question.entity';
import { QuestionNotFoundException } from './errors/question-not-found.exception';
import { ProductDoesntBelongToStore } from './errors/product-doesnt-belong-to-store.exception.dto';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private readonly questionsRepository: Repository<Question>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>
  ) {}

  async paginate({offset, perPage, filters: {
    id,
    productId,
    askedById,
    storeId,
  }, order}: QuestionPaginationOptionsDto): Promise<PaginationResult<Question>> {
    const queryBuilder = this.questionsRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.product', 'product')
      .leftJoinAndSelect('product.productImages', 'productImage')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('store.storeProfile', 'storeProfile')
      .leftJoinAndSelect('question.askedBy', 'askedBy')
      .leftJoinAndSelect('askedBy.client', 'client')
      .take(perPage)
      .skip(offset);

    Object.keys(order).forEach(key => queryBuilder.addOrderBy(`question.${key}`, order[key]));

    if (id) queryBuilder.andWhere('question.id = :id', { id });

    if (productId) queryBuilder.andWhere('question.productId = :productId', { productId });

    if (askedById) queryBuilder.andWhere('question.askedById = :askedById', { askedById });

    if (storeId) queryBuilder.andWhere('product.storeId = :storeId', { storeId });

    const [questions, total] = await queryBuilder.getManyAndCount();

    return new PaginationResult(questions, total, perPage);
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = Question.create(createQuestionDto);

    return await this.questionsRepository.save(question);
  }

  async answerQuestion({id, answeredById, answer}: AnswerQuestionDto): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id, answer: IsNull() },
      relations: ['product'],
    });

    if (!question) {
      throw new QuestionNotFoundException();
    }

    const productBelongsToStore = (await this.productsRepository.createQueryBuilder('product')
      .innerJoin('product.store', 'store')
      .innerJoin('store.user', 'user')
      .where('product.id = :productId', { productId: question.product.id })
      .andWhere('user.id = :userId', { userId: answeredById })
      .getCount()
    ) > 0;

    if (!productBelongsToStore) {
      throw new ProductDoesntBelongToStore();
    }

    Object.assign(question, {
      answer,
      answeredAt: new Date(),
    });

    return await this.questionsRepository.save(question);
  }
}
