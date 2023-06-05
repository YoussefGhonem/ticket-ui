import { confirmPasswordValidatorFormControl } from './../../../@shared/custom-validators/confirm-password-form-controler.validator';
import { Validators } from "angular-reactive-validation";
import { emailValidator, whiteSpaceValidator } from "@shared/custom-validators";

export const RegisterValidator = {
  userAccount: {
    firstName: [
      Validators.required('First name is required'),
      whiteSpaceValidator(`Value should not be a white spaces`),
      Validators.minLength(2, minLength => `The minimum length is ${minLength}`),
      Validators.maxLength(50, maxLength => `Maximum length is ${maxLength}`),
    ],
    lastName: [
      Validators.required('Last name is required'),
      whiteSpaceValidator(`Value should not be a white spaces`),
      Validators.minLength(2, minLength => `The minimum length is ${minLength}`),
      Validators.maxLength(50, maxLength => `Maximum length is ${maxLength}`),
    ],
    email: [
      Validators.required('Email must be valid and not used'),
      whiteSpaceValidator(`Value should not be a white spaces`),
      Validators.minLength(3, minLength => `The minimum length is ${minLength}`),
      Validators.maxLength(320, maxLength => `Maximum length is ${maxLength}`),
      emailValidator(`Email is not valid`),
    ],
    password: [
      Validators.required('Password is required'),
      whiteSpaceValidator(`Value should not be a white spaces`),
      Validators.minLength(8, minLength => `The minimum length is ${minLength}`),
      Validators.maxLength(200, maxLength => `Maximum length is ${maxLength}`),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$', 'Invalid Format: Lowercase letters, Uppercase letters, Numbers'),
      Validators.pattern('^(?=.*?[^a-zA-Z0-9]).{1,}$', 'Invalid Format: Special characters')
    ],
    confirmPassword: (passwordControllerName: string) => [
      Validators.required('Confirm Password is required'),
      whiteSpaceValidator(`Value should not be a white spaces`),
      Validators.minLength(8, minLength => `The minimum length is ${minLength}`),
      Validators.maxLength(200, maxLength => `Maximum length is ${maxLength}`),
      // confirmPasswordValidatorFormControl(`Passwords do not match.`)
    ],
    callingCode: [
      Validators.required('Country Code is required')
    ],
    phoneNumber: [
      Validators.required('Phone Number is required'),
      Validators.minLength(4, minLength => `Minimum length is ${minLength}`),
      Validators.maxLength(20, maxLength => `Maximum length is ${maxLength}`),
      whiteSpaceValidator(`Value should not be a white spaces`),
    ],
    signature: [
      Validators.required('Signature is required'),
      whiteSpaceValidator(`Signature should not be a white spaces`),
    ],
    agreeTermsAndConditions: [
      Validators.requiredTrue('You should agree Terms & Conditions first.'),
    ]
  },

};
