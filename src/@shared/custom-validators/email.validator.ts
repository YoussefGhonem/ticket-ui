import { ValidatorDeclaration } from "angular-reactive-validation";

export const emailValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {

  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let value: string = control?.value;

  if (value && !value?.match(reg)) {
    return { emailInvalid: true };
  }

  return null;

}, 'emailInvalid');
