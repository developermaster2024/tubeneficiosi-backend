import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { EntityManager, FindOneOptions, ObjectType } from "typeorm";

type FindOptionsFactory = (value: any, object: Object) => FindOneOptions;

interface IsUniqueValidationArguments<T> extends ValidationArguments {
  constraints: [ObjectType<T>, FindOptionsFactory];
}

@ValidatorConstraint({
  name: 'unique',
  async: true
})
@Injectable()
export class IsUniqueConstrain implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {}

  async validate<T>(value: any, { property, constraints, object }: IsUniqueValidationArguments<T>): Promise<boolean> {
    const [EntityType, findConditionsFactory] = constraints;

    const findConditions = typeof findConditionsFactory === 'function'
      ? findConditionsFactory(value, object)
      : { [property]: value };

    const record = await this.entityManager
      .getRepository(EntityType)
      .findOne(findConditions);

    return !record;
  }
  defaultMessage({ property }: ValidationArguments): string {
    return `${property} is already being used`;
  }
}

export const IsUnique = <T>(entityType: ObjectType<T>, findConditionsFactory?: FindOptionsFactory, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityType, findConditionsFactory],
      validator: IsUniqueConstrain,
    });
  };
}
