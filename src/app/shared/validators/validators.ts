
/*
  Custom validators to use in other validators.
*/

// SINGLE FIELD VALIDATORS
export function emailValidator(email: string) {
  // tslint:disable-next-line:max-line-length
  const emailRegexp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  return (email && emailRegexp.test(email));
}
