import { ValidatorDeclaration } from "angular-reactive-validation";

export const urlValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {

  const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
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
