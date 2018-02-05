import { User } from 'app/interfaces';
import { ValidForm } from 'app/interfaces';
import { emailValidator } from './validators';
export function registerValidation(user: User) {
  const errors: ValidForm = {
    success: true,
    message: ''
  };
  if (user.username.length === 0) {
    errors.success = false;
    errors.message += 'Username field can´t be empty';
  }
  if (user.email.length === 0) {
    errors.success = false;
    errors.message += 'Email field can´t be empty';
  }
  if (user.role.length === 0) {
    errors.success = false;
    errors.message += 'Role field can´t be empty';
  }
  if (!emailValidator(user.email)) {
    errors.success = false;
    errors.message += 'Invalid email';
  }
  return errors;
}
