import { Module } from '@nestjs/common';
import { ExistsConstrain } from './exists.constrain';
import { IsUniqueConstrain } from './is-unique.constrain';

@Module({
  providers: [IsUniqueConstrain, ExistsConstrain]
})
export class ValidationModule {}
