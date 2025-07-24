import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { TermsOfServicePageComponent } from './components/pages/terms-of-service-page/terms-of-service-page.component';
import { HomeComponent } from './components/pages/home-page/home.component';
import { MyProfilePageComponent } from './components/pages/my-profile-page/my-profile-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { TournamentComponent } from './components/pages/tournament-page/tournament-page.component';
import { GamesComponent } from './components/common/games/games.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { ForgotPasswordPageComponent } from './components/pages/forgot-password-page/forgot-password-page.component';
import { SignInPageComponent } from './components/pages/sign-in-page/sign-in-page.component';
import { GameNewsPageComponent } from './components/pages/game-news-page/game-news-page.component';
import { GameDetailsPageComponent } from './components/pages/game-details-page/game-details-page.component';
import { BookingPageComponent } from './components/pages/booking-page/booking-page.component';
import { OtpPageComponent } from './components/pages/otp-page/otp-page.component';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutPageComponent },
    { path: 'games', component: GamesComponent },
    { path: 'game/:id', component: GameDetailsPageComponent },
    { path: 'game-news', component: GameNewsPageComponent },
    { path: 'booking', component: BookingPageComponent },
    { path: 'tournament', component: TournamentComponent },
    { path: 'contact', component: ContactPageComponent },
    { path: 'sign-in', component: SignInPageComponent },
    { path: 'verify-otp', component: OtpPageComponent },
    { path: 'forgot-password', component: ForgotPasswordPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'my-profile', component: MyProfilePageComponent },
    { path: 'terms-of-service', component: TermsOfServicePageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'payment', component: PaymentPageComponent },

    // Admin Module
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}