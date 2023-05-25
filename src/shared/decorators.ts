/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ValidationOptions, registerDecorator } from 'class-validator';
import { Field, FieldOptions, registerEnumType } from 'type-graphql';
import { EnumConfig, MethodAndPropDecorator } from 'type-graphql/dist/decorators/types';

/**
 * Type graphql field decorator for enums.
 * @param enumObj - the `enum` object
 * @param opts - the options to configure this field
 * @returns a type graphql field decorator
 */
export function EnumField<T extends object>(
  enumObj: () => T,
  opts: FieldOptions & Partial<EnumConfig<T>> & { enumName: string },
): MethodAndPropDecorator {
  const { enumName, description, valuesConfig, ...fieldOpts } = opts;

  registerEnumType(enumObj(), {
    name: enumName,
    description,
    valuesConfig,
  });

  return Field(enumObj, { description, ...fieldOpts });
}

/**
 * Class validator decorator to check for duplicate items in an array
 * @param objKeys - the keys to check for. If undefined, checks for duplicates items in array.
 * @param validationOptions the extra validation options
 * @returns the validator decorator
 */
export function ArrayDuplicates(
  objKeys: string[] = [],
  validationOptions?: ValidationOptions,
) {
  const hasForDuplicates = (value: Array<string | number | object>): boolean => {
    let duplicateFound = false;
    for (const objKey of objKeys) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dupMap = value.reduce((p: Record<string, number>, c: any) => {
        const key = !!objKey && c[objKey] ? c[objKey] : c;
        // eslint-disable-next-line prefer-const
        let val = p[`${key}`];
        p[`${key}`] = !!val ? val + 1 : 1;
        return p;
      }, {} as Record<string, number>);

      duplicateFound = Object.values(dupMap).some((v) => v > 1);

      if (duplicateFound) break;
    }
    return duplicateFound;
  };

  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'arrayDuplicates',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message:
          validationOptions?.message ||
          `Duplicates found. ${propertyName} cannot contain duplicates.`,
        ...(validationOptions || {}),
      },
      validator: {
        validate(value: string) {
          return typeof value === 'object' && !hasForDuplicates(value);
        },
      },
    });
  };
}
