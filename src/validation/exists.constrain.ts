import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { EntityManager, ObjectType } from "typeorm";

interface ExistsValidationArguments<T> extends ValidationArguments {
  constraints: [ObjectType<T>, string?];
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

  async validate<T>(value: any, { property, constraints }: ExistsValidationArguments<T>): Promise<boolean> {
    const [EntityType, entityPropertyName = 'id'] = constraints;

    const count = await this.entityManager
      .getRepository(EntityType)
      .count({
        [entityPropertyName]: value
      });

    return count > 0;
  }

  defaultMessage({ property }: ValidationArguments): string {
    return `${property} is invalid`;
  }
}

export const Exists = <T>(entityType: ObjectType<T>, entityPropertyName?: string, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityType, entityPropertyName],
      validator: ExistsConstrain,
    });
  };
}
