import { Validators } from "angular-reactive-validation";

export const DeactivateValidator = {
    reason: [
        Validators.required('reason is required.'),
        Validators.minLength(10, minLength => `Minimum length is ${minLength}`),
        Validators.maxLength(500, maxLength => `Maximum length is ${maxLength}`)
    ]
}
