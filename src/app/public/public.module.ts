import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  

import { HomeComponent } from '../components/pages/home-page/home.component';
import { HomePageComponent } from '../components/pages/home-page/home-banner/home-page.component'; 
import { AboutPageComponent } from '../components/pages/about-page/about-page.component';
import { ContactPageComponent } from '../components/pages/contact-page/contact-page.component';
import { GamesComponent } from '../components/common/games/games.component';
import { PublicRoutingModule } from './public-routing.module';
import { GameDetailsPageComponent } from '../components/pages/game-details-page/game-details-page.component';
import { GameNewsPageComponent } from '../components/pages/game-news-page/game-news-page.component';
import { TournamentComponent } from '../components/pages/tournament-page/tournament-page.component';
import { TermsOfServicePageComponent } from '../components/pages/terms-of-service-page/terms-of-service-page.component';
import { PrivacyPolicyPageComponent } from '../components/pages/privacy-policy-page/privacy-policy-page.component';
import { HeroContentComponent } from '../components/common/hero-content/hero-content.component';
import { WhyChooseUsComponent } from '../components/common/why-choose-us/why-choose-us.component';

@NgModule({
    declarations: [
        HomeComponent,
        HomePageComponent,       
        HeroContentComponent,
        WhyChooseUsComponent,
        AboutPageComponent,
        ContactPageComponent,
        GamesComponent,
        GameDetailsPageComponent,
        GameNewsPageComponent,
        TournamentComponent,
        TermsOfServicePageComponent,
        PrivacyPolicyPageComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,  
        PublicRoutingModule,
    ]
})
export class PublicModule { }