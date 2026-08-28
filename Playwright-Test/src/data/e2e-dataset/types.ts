import { User } from '../../api/models/user.model';

export interface TestCaseRecord<T = any> {
  tcId?: string;
  description: string;
  user?: User;
  payload: T;
}
