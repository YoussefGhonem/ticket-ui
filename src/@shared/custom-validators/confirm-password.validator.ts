import { FormGroup } from "@angular/forms";

export const confirmPasswordValidator = (passwordControl: string, confirmPasswordControl: string) => {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[passwordControl];
    const matchingControl = formGroup.controls[confirmPasswordControl];

    // if (matchingControl.errors && !matchingControl.errors.mustMatch) return;
    if (control.value !== matchingControl.value) matchingControl.setErrors({mustMatch: true});
    else matchingControl.setErrors(null);
  }
}
