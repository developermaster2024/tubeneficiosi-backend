import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

interface IsUniqueValidationArguments extends ValidationArguments {
  constraints: string[];
}


@ValidatorConstraint({
  name: 'mime-type'
})
@Injectable()
export class MimeTypeConstrain implements ValidatorConstraintInterface {
  validate(value: {mimetype?: string}, {constraints}: IsUniqueValidationArguments): boolean | Promise<boolean> {
    return constraints.includes(value?.mimetype);
  }
  defaultMessage({ value, targetName, property }: ValidationArguments): string {
    return `${value?.mimetype} is not allowed for ${property}`;
  }
}

export const IsMimeType = (mimeTypes: string[], validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: mimeTypes,
      validator: MimeTypeConstrain,
    });
  };
}
