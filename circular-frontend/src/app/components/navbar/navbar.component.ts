import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheckCircle2,
  lucideChevronDown,
  lucideCircle,
  lucideHelpCircle,
  lucideLink,
  lucideLogOut,
} from '@ng-icons/lucide';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    HlmNavigationMenuImports,
    BrnNavigationMenuImports,
    HlmIconImports,
    HlmAvatarImports,
    HlmButton,
    HlmAvatarImports
  ],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideLink,
      lucideCircle,
      lucideHelpCircle,
      lucideCheckCircle2,
      lucideLogOut,
    }),
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly _entdeckenComponents = [
    {
      title: 'Alle Produkte',
      href: '/marketplace',
    },
    {
      title: 'Jacken',
      href: '/marketplace',
    },
    {
      title: 'Hosen',
      href: '/marketplace',
    },
    {
      title: 'Hemden',
      href: '/marketplace',
    },
    {
      title: 'Hoodies',
      href: '/marketplace',
    },
    {
      title: 'Shorts',
      href: '/marketplace',
    },

    {
      title: 'T-Shirts',
      href: '/marketplace',
    },
    {
      title: 'Kleider',
      href: '/marketplace',
    },
  ];

  protected readonly _settingComponents = [
    {
      title: 'Profile',
      href: '/components/alert-dialog',
      iconName: '',
      iconClass: '',
    },
    {
      title: 'Docs',
      href: '/components/hover-card',
      iconName: '',
      iconClass: '',
    },
    {
      title: 'Abmelden',
      action: 'logout',
      iconName: 'lucideLogOut',
      iconClass: 'relative top-[2px] ml-1 size-3',
    },
  ];

  protected readonly authService = inject(AuthService);
  router = inject(Router)

  //todo: should navigate to landing page: /
  onLogOut() {
    this.router.navigate(['/']);
    this.authService.logout();
  }
}
