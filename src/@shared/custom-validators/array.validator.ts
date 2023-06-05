import { ValidatorDeclaration } from "angular-reactive-validation";

export const arrayValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {
  return Array.isArray(control.value)
  && control.value.filter(v => !v).length === 0
      ? null : {invalidArray: true};
}, 'invalidArray');
