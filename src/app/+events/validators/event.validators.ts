import { urlForHttpValidator } from './../../../@shared/custom-validators/url-http.validator';
import { Validators } from "angular-reactive-validation";
import { urlValidator, whiteSpaceHtmlValidator, whiteSpaceValidator } from "@shared/custom-validators";

export const EventValidator = {
  name: [
    Validators.required('Name is required'),
    whiteSpaceValidator(`Value should not be a white spaces`),
    Validators.minLength(3, minLength => `The minimum length is ${minLength}`),
    Validators.maxLength(50, maxLength => `Maximum length is ${maxLength}`),
  ],
  description: [
    Validators.required('description is required'),
    whiteSpaceHtmlValidator(`Value should not be a white spaces`),
  ],
  reason: [
    Validators.required('Reason is required'),
    whiteSpaceValidator(`Value should not be a white spaces`),
    Validators.minLength(2, minLength => `The minimum length is ${minLength}`),
    Validators.maxLength(500, maxLength => `Maximum length is ${maxLength}`),
  ],
  termsAndConditions: [
    Validators.required('terms and conditions is required'),
    whiteSpaceValidator(`Value should not be a white spaces`),
  ],
  startDate: [
    Validators.required('Start Date and Time are required')
  ],
  endDate: [
    Validators.required('End date and time are required')
  ],
  eventType: [
    Validators.required('Event type is required')
  ],
  coverImage: [
    Validators.required('Cover image is required')
  ],
  locationLink: [
    urlForHttpValidator('Link is not valid')
  ],
  performance: [
    Validators.required('Performance is required'),
    whiteSpaceValidator('Performance value should not be a white space.'),
    Validators.minLength(5, minLength => `The minimum length is ${minLength}`),
    Validators.maxLength(200, maxLength => `The maximum length is ${maxLength}`)
  ]

};
