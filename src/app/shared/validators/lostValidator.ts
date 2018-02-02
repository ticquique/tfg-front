import { ValidForm } from 'app/interfaces';
import { emailValidator } from './validators';
export function lostValidation(email: string, username: string) {
  const errors: ValidForm = {
    success: true,
    message: ''
  };
  if (email.length === 0 && username.length === 0) {
    errors.success = false;
    errors.message += 'Email or username field must be filled';
  }
  if (email.length > 0 && username.length > 0) {
    errors.success = false;
    errors.message += 'Fill only one of the two fields';
  }
  if (email.length > 0 && !emailValidator(email)) {
    errors.success = false;
    errors.message += 'Invalid email';
  }
  return errors;
}
