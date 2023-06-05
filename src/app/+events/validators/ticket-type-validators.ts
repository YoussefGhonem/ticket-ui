import { Validators } from "angular-reactive-validation";
import { emailValidator, whiteSpaceValidator } from "@shared/custom-validators";

export const TicketTypeValidator = {
    title: [
        Validators.required('Title is required'),
        whiteSpaceValidator(`Value should not be a white spaces`),
        Validators.minLength(3, minLength => `The minimum length is ${minLength}`),
        Validators.maxLength(200, maxLength => `Maximum length is ${maxLength}`),
    ],
    description: [
        whiteSpaceValidator(`Value should not be a white spaces`),
    ],
    ticketPrice: [
        Validators.required('Price is required'),
        Validators.min(0.001, min => `Price should be greater than or equal to 0`),
        Validators.max(999999, max => `Price should be less than or equal to ${max}`),
    ],
    ticketQuantity: [
        Validators.required('Quantity is required'),
        Validators.pattern('^[1-9][0-9]*$', 'Quantity should not start with 0'),
        Validators.pattern('^[0-9][0-9]*$', 'Quantity must be an integer number'),
        Validators.maxLength(6, maxLength => `Value can't exceed ${maxLength} digits.`)
    ],
    maxPurchasePerTicketType: [
        // Validators.pattern('^[1-9][0-9]*$', 'Max Purchase should not start with 0'),
        Validators.pattern('^[0-9][0-9]*$', 'Max Purchase must be an integer number'),
        Validators.maxLength(6, maxLength => `Value can't exceed ${maxLength} digits.`)
    ],
    email: [
        whiteSpaceValidator(`Value should not be a white spaces`),
        Validators.minLength(3, minLength => `The minimum length is ${minLength}`),
        Validators.maxLength(230, maxLength => `Maximum length is ${maxLength}`),
        emailValidator(`Email is not valid`),
    ]
}
