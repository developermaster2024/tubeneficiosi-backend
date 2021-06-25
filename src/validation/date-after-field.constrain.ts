import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isAfter } from "date-fns";

interface DateAfterFieldValidationArguments extends ValidationArguments {
  constraints: [string];
}

@ValidatorConstraint({
  name: 'date_before_field',
})
@Injectable()
export class DateAfterFieldConstrain implements ValidatorConstraintInterface {
  async validate(value: any, { constraints, object }: DateAfterFieldValidationArguments): Promise<boolean> {
    const [otherFieldName] = constraints;

    return isAfter(new Date(value), new Date(object[otherFieldName]));
  }

  defaultMessage({ property, constraints }: DateAfterFieldValidationArguments): string {
    const [otherFieldName] = constraints;
    return `${property} must be after ${otherFieldName}`;
  }
}

export const DateAfterField = (otherFieldName: string, validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [otherFieldName],
      validator: DateAfterFieldConstrain,
    });
  };
}
