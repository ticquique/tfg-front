import { User } from 'app/interfaces';
import { ValidForm } from 'app/interfaces';
export function loginValidation(user: User) {
  const errors: ValidForm = {
    success: true,
    message: ''
  };
  if (user.username.length === 0) {
    errors.success = false;
    errors.message += 'Username field can´t be empty';
  }
  if (user.password.length === 0) {
    errors.success = false;
    errors.message += 'Password field can´t be empty';
  }
  return errors;
}
