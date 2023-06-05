import { ValidatorDeclaration } from "angular-reactive-validation";

export const hasLengthValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {
  return !!control?.value
  && Array.isArray(control.value)
  && control.value.length
      ? null : {arrayInvalid: true};
}, 'arrayInvalid');
