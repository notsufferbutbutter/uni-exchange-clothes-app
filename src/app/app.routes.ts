import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticlesComponent } from './pages/articles/articles.component';
import { ClosetComponent } from './pages/closet/closet.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ChatComponent } from './pages/chat/chat.component';
import { TauschangebotComponent } from './pages/tauschangebot/tauschangebot.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'closet', component: ClosetComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'marketplace', component: MarketplaceComponent},
  { path: 'favorites', component: FavoritesComponent},
  { path: 'chat', component: ChatComponent},
  { path: 'tauschangebot', component: TauschangebotComponent},

];
