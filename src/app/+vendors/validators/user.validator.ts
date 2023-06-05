import { Validators } from "angular-reactive-validation";
import { emailValidator, whiteSpaceValidator } from "@shared/custom-validators";

export const UsersValidator = {
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
    Validators.required('Email is required'),
    whiteSpaceValidator(`Value should not be a white spaces`),
    Validators.minLength(3, minLength => `The minimum length is ${minLength}`),
    Validators.maxLength(320, maxLength => `Maximum length is ${maxLength}`),
    emailValidator(`Email is not valid`),
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
  password: [
    Validators.required('Password is required'),
    whiteSpaceValidator(`Value should not be a white spaces`),
    Validators.minLength(8, minLength => `The minimum length is ${minLength}`),
    Validators.maxLength(100, maxLength => `Maximum length is ${maxLength}`),
    Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$', 'Invalid Format: Lowercase letters, Uppercase letters, Numbers'),
    Validators.pattern('^(?=.*?[~`!@#$%^&*();\\\\:"+-/_<>.|^{},’،=?\']).{1,}$', 'Invalid Format: Special characters')
  ],
  confirmPassword: [
    Validators.required('Confirm Password is required'),
    whiteSpaceValidator(`Value should not be a white spaces`),
    Validators.minLength(8, minLength => `The minimum length is ${minLength}`),
    Validators.maxLength(100, maxLength => `Maximum length is ${maxLength}`),
  ],
};
