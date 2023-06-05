import { Validators } from "angular-reactive-validation";
import { whiteSpaceHtmlValidator } from "@shared/custom-validators";

export const SettingsValidator = {
  fees: [
    Validators.required('Fees is required'),
    Validators.pattern("^[1-9][0-9]?([.][0-9]{1,2})?$", "Invalid Fees Percentage")
  ],
  verificationDocument: [
    Validators.required('Verification Document is required')
  ],
  termsAndConditions: [
    Validators.required('Terms & Conditions are required'),
    whiteSpaceHtmlValidator(`Value should not be a white spaces`),
  ],
};
