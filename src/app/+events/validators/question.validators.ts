import { Validators } from "angular-reactive-validation";
import { emailValidator, whiteSpaceValidator } from "@shared/custom-validators";

export const QuestionValidator = {
    question: [
        Validators.required('Question is required'),
        whiteSpaceValidator(`Question should not be a white spaces`),
        Validators.minLength(5, minLength => `The minimum length is ${minLength}`),
        Validators.maxLength(250, maxLength => `Maximum length is ${maxLength}`),
    ],
    choice: [
        Validators.required('Option is required'),
        whiteSpaceValidator(`Option should not be a white spaces`),
        Validators.minLength(2, minLength => `The minimum length is ${minLength}`),
        Validators.maxLength(250, maxLength => `Maximum length is ${maxLength}`),
    ],
}
