import { Component, effect, inject } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service'; 
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MarketplaceItemComponent } from "../marketplace/marketplace-item/marketplace-item.component";
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-favorites',
    imports: [NavbarComponent, MarketplaceItemComponent],
    template: `
        <app-navbar></app-navbar>
        <main class="px-4 pt-20">
            <h2 class="text-center text-3xl font-bold">MEINE FAVORITEN</h2>

            @if (favorites().length === 0) {
                <p class="text-center mt-8 text-lg text-gray-600">
                    Sie haben noch keine Artikel zu Ihren Favoriten hinzugefügt.
                </p>
            } @else {
                <div
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                    @for (item of favorites(); track item.id) {
                        <app-marketplace-item [item]="item"></app-marketplace-item>
                    }
                </div>
            }
        </main>
    `,
})
export class FavoritesComponent {
    public readonly favouritesService = inject(FavoritesService);
    public readonly userService = inject(UserService);
    readonly favorites = this.favouritesService.favourites;

    constructor() {
        effect(async () => {
            const currentUserId = this.userService.currentProfileUser()?.user_id;
            if (currentUserId) {
                await this.favouritesService.loadFavorites(currentUserId);
            }
        });
    }
}