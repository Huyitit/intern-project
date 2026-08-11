import { BaseDataGenerator } from './base-data.generator';

export class UserDataGenerator extends BaseDataGenerator {
  private static FULLNAME_MIN_LENGTH = 6;
  private static FULLNAME_MAX_LENGTH = 20;

  private static USERNAME_MIN_LENGTH = 6;
  private static USERNAME_MAX_LENGTH = 20;

  private static PASSWORD_MIN_LENGTH = 6;
  private static PASSWORD_MAX_LENGTH = 20;

  // --- Full Name Methods ---
  static validFullname(prefix?: string): string {
    return this.constrainLength(this.setPrefix(this.faker.person.fullName(), prefix), this.FULLNAME_MIN_LENGTH, this.FULLNAME_MAX_LENGTH);
  }

  static underBoundFullname(prefix?: string): string {
    return this.constrainLength(this.setPrefix(this.faker.person.fullName(), prefix), this.FULLNAME_MIN_LENGTH - 1, this.FULLNAME_MIN_LENGTH - 1);
  }

  static upperBoundFullname(prefix?: string): string {
    return this.constrainLength(this.setPrefix(this.faker.person.fullName(), prefix), this.FULLNAME_MAX_LENGTH + 1, this.FULLNAME_MAX_LENGTH + 1);
  }

  static sqlInjectionString(): string {
    return "test' OR '1'='1";
  }

  // --- Username Methods ---
  static validUsername(prefix?: string): string {
    return this.constrainLength(
      this.setPrefix(this.faker.internet.username().replace(/[^a-zA-Z0-9]/g, '') + this.faker.string.numeric(2), prefix),
      this.USERNAME_MIN_LENGTH,
      this.USERNAME_MAX_LENGTH
    ).toLowerCase();
  }


  static underBoundUsername(prefix?: string): string {
    const value = this.setPrefix(this.faker.internet.username(), prefix);
    return this.constrainLength(value, this.USERNAME_MIN_LENGTH - 1, this.USERNAME_MIN_LENGTH - 1);
  }

  static upperBoundUsername(prefix?: string): string {
    const value = this.setPrefix(this.faker.internet.username(), prefix);
    return this.constrainLength(value, this.USERNAME_MAX_LENGTH + 1, this.USERNAME_MAX_LENGTH + 1);
  }

  static nonExistentUsername(prefix?: string): string {
    const value = `ghostuser_${Date.now().toString().substring(0, 5)}${this.faker.string.numeric(5)}`;
    return this.constrainLength(this.setPrefix(value, prefix), this.USERNAME_MIN_LENGTH, this.USERNAME_MAX_LENGTH);
  }

  // --- Password Methods ---
  static validPassword(prefix?: string): string {
    const value = this.setPrefix(this.faker.internet.password(), prefix);
    return this.constrainLength(value, this.PASSWORD_MIN_LENGTH, this.PASSWORD_MAX_LENGTH);
  }

  static underBoundPassword(prefix?: string): string {
    const value = this.setPrefix(this.faker.internet.password(), prefix);
    return this.constrainLength(value, this.PASSWORD_MIN_LENGTH - 1, this.PASSWORD_MIN_LENGTH - 1);
  }

  static upperBoundPassword(prefix?: string): string {
    const value = this.setPrefix(this.faker.internet.password(), prefix);
    return this.constrainLength(value, this.PASSWORD_MAX_LENGTH + 1, this.PASSWORD_MAX_LENGTH + 1);
  }

  // --- Email Methods ---
  static validEmail(prefix?: string): string {
    return this.setPrefix(this.faker.internet.email(), prefix);
  }

  static validEmailByUsername(username: string, prefix?: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomPrefix = Date.now().toString().substring(0, 6);
    const value = `${username}${randomPrefix}@${domain}`;
    return this.setPrefix(value, prefix);
  }

  static invalidEmail(prefix?: string): string {
    const value = 'invalidEmail' + Date.now().toString().substring(0, 7);
    return this.setPrefix(value, prefix);
  }

  // --- Phone Methods ---
  static validPhone(includeSpace: boolean = false, includePrefix: boolean = false, prefix: string = "84"): string {
    let phone = this.faker.phone.number({ style: 'mobile' });

    if (includeSpace) {
      phone = phone.substring(0, 3) + ' ' + phone.substring(3);
    }

    if (includePrefix) {
      const prefix = '+' + Math.floor(Math.random() * 100);
      phone = prefix + phone;
    }

    return this.setPrefix(phone.substring(2, phone.length), prefix);
  }

  static invalidPhone(type: 'underBound' | 'upperBound', prefix: string = "84") : string {
    const phone = this.faker.phone.number({ style: 'mobile' });
    const formatted = this.setPrefix(phone.substring(2), prefix);

    if (type === 'underBound') {
      return this.constrainLength(formatted, 0, 9);
    }

    if (type === 'upperBound') {
      return this.constrainLength(formatted, 16, 20);
    }

    return formatted;
  }
}
