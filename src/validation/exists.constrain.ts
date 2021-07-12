import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { EntityManager, FindOneOptions, ObjectType } from "typeorm";

type FindOptionsFactory = (value: any, object: Object) => FindOneOptions;

interface ExistsValidationArguments<T> extends ValidationArguments {
  constraints: [ObjectType<T>, string?, FindOptionsFactory?];
}

@ValidatorConstraint({
  name: 'exists',
  async: true,
})
@Injectable()
export class ExistsConstrain implements ValidatorConstraintInterface {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {}

  async validate<T>(value: any, { constraints, object }: ExistsValidationArguments<T>): Promise<boolean> {
    const [EntityType, entityPropertyName = 'id', findConditionsFactory] = constraints;

    const findConditions = typeof findConditionsFactory === 'function'
      ? findConditionsFactory(value, object)
      : { [entityPropertyName]: value };

    const count = await this.entityManager
      .getRepository(EntityType)
      .count(findConditions);

    return count > 0;
  }

  defaultMessage({ property }: ValidationArguments): string {
    return `${property} is invalid`;
  }
}

export const Exists = <T>(entityType: ObjectType<T>, entityPropertyName?: string, findConditionsFactory?: FindOptionsFactory, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityType, entityPropertyName, findConditionsFactory],
      validator: ExistsConstrain,
    });
  };
}
