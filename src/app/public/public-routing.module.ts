import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/pages/home-page/home.component';
import { AboutPageComponent } from '../components/pages/about-page/about-page.component';
import { ContactPageComponent } from '../components/pages/contact-page/contact-page.component';
import { GamesComponent } from '../components/common/games/games.component';
import { GameDetailsPageComponent } from '../components/pages/game-details-page/game-details-page.component';
import { GameNewsPageComponent } from '../components/pages/game-news-page/game-news-page.component';
import { TermsOfServicePageComponent } from '../components/pages/terms-of-service-page/terms-of-service-page.component';
import { PrivacyPolicyPageComponent } from '../components/pages/privacy-policy-page/privacy-policy-page.component';
import { TournamentComponent } from '../components/pages/tournament-page/tournament-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'contact', component: ContactPageComponent },
  { path: 'games', component: GamesComponent },
  { path: 'game/:id', component: GameDetailsPageComponent },
  { path: 'game-news', component: GameNewsPageComponent },
  { path: 'terms-of-service', component: TermsOfServicePageComponent },
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'tournament', component: TournamentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }