import { faker } from '@faker-js/faker';

export abstract class BaseDataGenerator {
  protected static faker = faker;

  protected static constrainLength(value: string, min: number, max: number): string {
    if (value.length > max) {
      return value.substring(0, max);
    }
    while (value.length < min) {
      value += faker.string.alphanumeric(1);
    }
    return value;
  }

  /**
   * Generate custom field value by options
   */
  protected static customFieldValue(
    field?: string,
    length?: number,
    upperCase?: boolean,
    lowecase?: boolean,
    specialChars?: string,
    allowNumber?: boolean
  ): string {
    let result = '';
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';

    if (upperCase) {
      const index = Math.floor(Math.random() * upperCaseChars.length);
      result += upperCaseChars[index];
    }

    if (lowecase) {
      const index = Math.floor(Math.random() * lowerCaseChars.length);
      result += lowerCaseChars[index];
    }

    if (allowNumber) {
      const index = Math.floor(Math.random() * numberChars.length);
      result += numberChars[index];
    }

    if (specialChars) {
      const index = Math.floor(Math.random() * specialChars.length);
      result += specialChars[index];
    }

    if (length) {
      result = this.constrainLength(result, length, length);
    }

    return result;
  }
}
