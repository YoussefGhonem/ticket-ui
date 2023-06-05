import { ValidatorDeclaration } from "angular-reactive-validation";

export const dateValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {
  return Date.parse(control.value)
      ? null : {invalidDate: true};
}, 'invalidDate');
