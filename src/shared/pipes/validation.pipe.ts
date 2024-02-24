import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTxtFile', async: false })
export class IsTxtFileConstraint implements ValidatorConstraintInterface {
  validate(fileName: string, args: ValidationArguments) {
    return fileName.endsWith('.txt');
  }

  defaultMessage(args: ValidationArguments) {
    return 'File must be a .txt file';
  }
}

export function IsTxtFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTxtFile',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsTxtFileConstraint,
    });
  };
}
