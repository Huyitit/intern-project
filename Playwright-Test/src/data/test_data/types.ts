import { User } from '../../api/models/user.model';

export interface TestCaseRecord<T = any> {
  description: string;
  user?: User;
  payload: T;
}
