import { ValidatorDeclaration } from "angular-reactive-validation";

export const whiteSpaceHtmlValidator = ValidatorDeclaration.wrapNoArgumentValidator(control => {

  const extractContent = (s: any) => {
    const span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  let value: string = extractContent(control?.value);

  if (value?.trim()?.length === 0) {
    return { isWhiteSpace: true };
  }

  return null;

}, 'isWhiteSpace');


/***
 * How to use it
 * [whiteSpaceHtmlValidator(`Value should not be a white spaces`)]
 * **/
