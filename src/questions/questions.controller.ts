import { Body, Controller, Get, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { PaginationResult } from 'src/support/pagination/pagination-result';
import { Role } from 'src/users/enums/roles.enum';
import { AnswerQuestionDto } from './dto/answer-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ReadQuestionDto } from './dto/read-question.dto';
import { QuestionPaginationPipe } from './pipes/question-pagination.pipe';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async paginate(@Query(QuestionPaginationPipe) options: any): Promise<PaginationResult<ReadQuestionDto>> {
    return (await this.questionsService.paginate(options)).toClass(ReadQuestionDto);
  }

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor('askedById'))
  async create(@Body() createQuestionDto: CreateQuestionDto): Promise<ReadQuestionDto> {
    return plainToClass(ReadQuestionDto, await this.questionsService.create(createQuestionDto));
  }

  @Put(':id')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({id: 'id'}), new JwtUserToBodyInterceptor('answeredById'))
  async answerQuestion(@Body() answerQuestionDto: AnswerQuestionDto): Promise<ReadQuestionDto> {
    return plainToClass(ReadQuestionDto, await this.questionsService.answerQuestion(answerQuestionDto));
  }
}
