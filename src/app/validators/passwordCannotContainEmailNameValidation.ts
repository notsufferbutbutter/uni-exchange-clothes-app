import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordCannotContainsEmailNameValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
         
        const group = control as FormGroup;

        if ( !group ) return null;

        const email = group.controls['email']?.value;

        const password = group.controls['password']?.value;

        const emailName = email.split('@')[0];

        const containsEmailName = password.toLowerCase().includes(emailName.toLowerCase());

        if (containsEmailName) {
            group.controls['password'].setErrors({ containsEmailName: true });
            return { containsEmailName: true };
        }

        return null;
    }
}
