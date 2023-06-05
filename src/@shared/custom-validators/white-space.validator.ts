import { ValidatorDeclaration } from "angular-reactive-validation";

export const whiteSpaceValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {

  let value: string = control?.value;

  if (value?.length > 0 && value?.trim()?.length === 0) {
    return {isWhiteSpace: true};
  }

  return null;

}, 'isWhiteSpace');


/***
 * How to use it
 * [whiteSpaceValidator(`Value should not be a white spaces`)]
 * **/
