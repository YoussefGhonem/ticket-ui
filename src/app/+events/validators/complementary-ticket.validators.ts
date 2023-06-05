import { Validators } from "angular-reactive-validation";
import { emailValidator, whiteSpaceValidator } from "@shared/custom-validators";

export const ComplementaryTicketValidator = {
    description: [
        whiteSpaceValidator(`Value should not be a white spaces`),
    ],
    ticketQuantity: [
        Validators.required('Quantity is required'),
        Validators.pattern('^[1-9][0-9]*$', 'Quantity should not start with 0'),
        Validators.pattern('^[0-9][0-9]*$', 'Quantity must be an integer number'),
        Validators.maxLength(6, maxLength => `Value can't exceed ${maxLength} digits.`)
    ],
    email: [
        whiteSpaceValidator(`Value should not be a white spaces`),
        Validators.minLength(3, minLength => `The minimum length is ${minLength}`),
        Validators.maxLength(230, maxLength => `Maximum length is ${maxLength}`),
        emailValidator(`Email is not valid`),
    ]
}
