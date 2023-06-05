import { ValidatorDeclaration } from "angular-reactive-validation";

export const phoneValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {
  return !!control?.value ? null : {phoneInvalid: true};
}, 'phoneInvalid');
