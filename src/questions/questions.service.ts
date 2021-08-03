import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { FindConditions, Repository } from 'typeorm';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionPaginationOptionsDto } from './dto/question-pagination-options.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(@InjectRepository(Question) private readonly questionsRepository: Repository<Question>) {}

  async paginate({offset, perPage, filters}: QuestionPaginationOptionsDto): Promise<PaginationResult<Question>> {
    const where: FindConditions<Question> = {};

    // @ts-ignore
    if (filters.id) where.id = +filters.id;

    if (filters.productId) where.productId = +filters.productId;

    // @TODO: Add filter by store

    const [questions, total] = await this.questionsRepository.findAndCount({
      take: perPage,
      skip: offset,
      where,
      relations: ['answeredBy', 'answeredBy.client']
    })

    return new PaginationResult(questions, total, perPage);
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = Question.create(createQuestionDto);

    return await this.questionsRepository.save(question);
  }

  // @TODO: Validate that only the store that owns the product can answer this question
  async answerQuestion({id, productId, answer}: AnswerQuestionDto): Promise<Question> {
    const question = await this.questionsRepository.findOne(id);

    Object.assign(question, {answer, answeredAt: new Date()});

    return await this.questionsRepository.save(question);
  }
}
