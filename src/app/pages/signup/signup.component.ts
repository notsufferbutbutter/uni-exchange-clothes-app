import { Component, inject, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HlmError } from '@spartan-ng/helm/form-field';
import { AuthService } from '../../services/auth.service';
import { passwordCannotContainsEmailNameValidation } from '../../validators/passwordCannotContainEmailNameValidation';
import { passwordStrengthValidation } from '../../validators/passwordStrengthValidation';



@Component({
	selector: 'app-signup',
	imports: [HlmCardImports, HlmLabelImports, HlmInputImports, HlmButtonImports, RouterLink, ReactiveFormsModule, HlmError],
	providers: [provideIcons({ lucideCheck, lucideChevronDown })],
	host: {
		class: 'w-full max-w-md contents',
	},
	templateUrl: './signup.component.html'
})
export class SignupComponent {
	private readonly _fb = inject(FormBuilder);
	private readonly _authService = inject(AuthService);

	errorMessage = signal<string|null>(null);
	succeededMessage = signal<string|null>(null);

	public signupForm = this._fb.group(
		{
			email: ['', 
				[
					Validators.required,
					Validators.email
				]
			],
			password: ['', 
				[
					Validators.required,
					passwordStrengthValidation()
				]
			],
		},
		{ validators: passwordCannotContainsEmailNameValidation() }
	)

	async onSubmit() {
		if (this.signupForm.invalid) return;

		const { email, password } = this.signupForm.value;

		const { error, message } = await this._authService.signupNewUser(email!, password!);

		if ( error ) {
			this.errorMessage.set(error.message);
		}
		else {
			this.succeededMessage.set(message);
		}
	}

	get password() {
		return this.signupForm.controls['password'];
	}

	get email() {
		return this.signupForm.controls['email'];
	}
}