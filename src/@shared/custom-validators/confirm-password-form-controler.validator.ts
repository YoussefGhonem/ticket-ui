import { ValidatorDeclaration } from 'angular-reactive-validation';
import { FormControl } from "@angular/forms";

export const confirmPasswordValidatorFormControl = ValidatorDeclaration.wrapNoArgumentValidator((control: FormControl) => {
        let formGroup = control.parent;
        let formControllerName = formGroup?.controls['password']?.value ? 'password' : 'newPassword';
        return formGroup?.controls[formControllerName]?.value == control?.value ?
            null :
            {'isPasswordsEqual': true};

}, 'isPasswordsEqual');
