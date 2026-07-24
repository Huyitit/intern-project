import { BaseDataGenerator } from './base-data.generator';

export class UserDataGenerator extends BaseDataGenerator {
  private static FULLNAME_MIN_LENGTH = 6;
  private static FULLNAME_MAX_LENGTH = 20;

  private static USERNAME_MIN_LENGTH = 6;
  private static USERNAME_MAX_LENGTH = 20;

  private static PASSWORD_MIN_LENGTH = 6;
  private static PASSWORD_MAX_LENGTH = 20;

  // --- Full Name Methods ---
  static validFullname(): string {
    return this.constrainLength(this.faker.person.fullName(), this.FULLNAME_MIN_LENGTH, this.FULLNAME_MAX_LENGTH);
  }

  static underBoundFullname(): string {
    return this.constrainLength(this.faker.person.fullName(), this.FULLNAME_MIN_LENGTH - 1, this.FULLNAME_MIN_LENGTH - 1);
  }

  static upperBoundFullname(): string {
    return this.constrainLength(this.faker.person.fullName(), this.FULLNAME_MAX_LENGTH + 1, this.FULLNAME_MAX_LENGTH + 1);
  }

  static sqlInjectionString(): string {
    return "Test' OR '1'='1";
  }

  // --- Username Methods ---
  static validUsername(): string {
    return this.constrainLength(
      this.faker.internet.username().replace(/[^a-zA-Z0-9]/g, '') + this.faker.string.numeric(2), 
      this.USERNAME_MIN_LENGTH, 
      this.USERNAME_MAX_LENGTH
    ).toLowerCase();
  }

  static underBoundUsername(): string {
    return this.constrainLength(this.faker.internet.username(), this.USERNAME_MIN_LENGTH - 1, this.USERNAME_MIN_LENGTH - 1);
  }

  static upperBoundUsername(): string {
    return this.constrainLength(this.faker.internet.username(), this.USERNAME_MAX_LENGTH + 1, this.USERNAME_MAX_LENGTH + 1);
  }

  // --- Password Methods ---
  static validPassword(): string {
    return this.constrainLength(this.faker.internet.password(), this.PASSWORD_MIN_LENGTH, this.PASSWORD_MAX_LENGTH);
  }

  static underBoundPassword(): string {
    return this.constrainLength(this.faker.internet.password(), this.PASSWORD_MIN_LENGTH - 1, this.PASSWORD_MIN_LENGTH - 1);
  }

  static upperBoundPassword(): string {
    return this.constrainLength(this.faker.internet.password(), this.PASSWORD_MAX_LENGTH + 1, this.PASSWORD_MAX_LENGTH + 1);
  }

  // --- Email Methods ---
  static validEmail(): string {
    return this.faker.internet.email();
  }

  static validEmailByUsername(username: string): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomPrefix = Date.now().toString().substring(0, 6);
    return `${username}${randomPrefix}@${domain}`;
  }

  static invalidEmail(): string {
    return 'invalidEmail' + Date.now().toString().substring(0, 7);
  }

  // --- Phone Methods ---
  static validPhone(includeSpace: boolean = false, includePrefix: boolean = false): string {
    let phone = this.faker.phone.number({ style: 'mobile' });

    if (includeSpace) {
      phone = phone.substring(0, 3) + ' ' + phone.substring(3);
    }

    if (includePrefix) {
      const prefix = '+' + Math.floor(Math.random() * 100);
      phone = prefix + phone;
    }

    return phone;
  }

  static invalidPhone(type: 'underBound' | 'upperBound'): string {
    const phone = this.faker.phone.number({ style: 'mobile' });

    if (type === 'underBound') {
      return this.constrainLength(phone, 0, 9);
    }

    if (type === 'upperBound') {
      return this.constrainLength(phone, 11, 20);
    }

    return phone;
  }
}
