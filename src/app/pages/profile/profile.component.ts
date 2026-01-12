import { Component, computed, inject, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [
		HlmCheckboxImports,
		HlmTextareaImports,
		HlmButtonImports,
		HlmInputImports,
		HlmFieldImports,
		BrnSelectImports,
		HlmSelectImports,
		ReactiveFormsModule,
    NavbarComponent
	],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private userService = inject(UserService);
	public currentUser = computed(() => this.userService.currentProfileUser());

	public form = new FormGroup({
		username: new FormControl<string | null>(null, [Validators.required]),
		email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
		location_city: new FormControl<string | null>(null),
		location_country: new FormControl<string | null>(null),
		bio: new FormControl<string | null>(null),
	});

	public isSaving = false;
	public submitted = false;

	constructor() {
		effect(() => {
			const user = this.currentUser();
			this.form.patchValue({
				username: user?.username ?? null,
				email: user?.email ?? null,
				location_city: user?.location_city ?? null,
				location_country: user?.location_country ?? null,
				bio: user?.bio ?? null,
			}, { emitEvent: false });
		});
	}

	async submit() {
		this.submitted = true;
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		this.isSaving = true;
		const { username, email, location_city, location_country, bio } = this.form.getRawValue();
		const updated = await this.userService.updateCurrentProfileUser({
			username: username ?? undefined,
			email: email ?? undefined,
			location_city: location_city ?? undefined,
			location_country: location_country ?? undefined,
			bio: bio ?? undefined,
		});
		this.isSaving = false;
	}
}
