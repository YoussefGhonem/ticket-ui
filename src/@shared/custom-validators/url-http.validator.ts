import { ValidatorDeclaration } from "angular-reactive-validation";

export const urlForHttpValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {

  const reg = /([a-z]*\.)?[a-z]*\.[a-z]{2,}(\/)?$/;
  let value: string = control?.value;

  if (value && !value?.match(reg)) {
    return {urlInvalid: true};
  }

  return null;

}, 'urlInvalid');


/***
 * How to use it
 * [urlValidator(`Url is not a valid Url`)]
 * **/
