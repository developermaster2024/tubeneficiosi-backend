import { Module } from '@nestjs/common';
import { IsUniqueConstrain } from './is-unique.constrain';

@Module({
  providers: [IsUniqueConstrain]
})
export class ValidationModule {}
