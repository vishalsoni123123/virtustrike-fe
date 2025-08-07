import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LightgalleryModule } from 'lightgallery/angular';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home-page/home.component';
import { HomePageComponent } from './components/pages/home-page/home-banner/home-page.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { TermsOfServicePageComponent } from './components/pages/terms-of-service-page/terms-of-service-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { GameDetailsPageComponent } from './components/pages/game-details-page/game-details-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { GamesComponent } from './components/common/games/games.component';
import { MyProfilePageComponent } from './components/pages/my-profile-page/my-profile-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TournamentComponent } from './components/pages/tournament-page/tournament-page.component';
import { ForgotPasswordPageComponent } from './components/pages/forgot-password-page/forgot-password-page.component';
import { SignInPageComponent } from './components/pages/sign-in-page/sign-in-page.component';
import { GameNewsPageComponent } from './components/pages/game-news-page/game-news-page.component';
import { WhyChooseUsComponent } from './components/common/why-choose-us/why-choose-us.component';
import { BookingPageComponent } from './components/pages/booking-page/booking-page.component';
import { HeroContentComponent } from './components/common/hero-content/hero-content.component';
import { OtpPageComponent } from './components/pages/otp-page/otp-page.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';
import { NgChartsModule } from 'ng2-charts';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { VerifyResetOtpComponent } from './components/pages/verify-reset-otp-page/verify-reset-otp.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		HomeComponent,
		GamesComponent,
		HeroContentComponent,
		WhyChooseUsComponent,
		FooterComponent,
		HomePageComponent,
		AboutPageComponent,
		ContactPageComponent,
		GameDetailsPageComponent,
		GameNewsPageComponent,
		TournamentComponent,
		RegisterPageComponent,
		SignInPageComponent,
		OtpPageComponent,
		ForgotPasswordPageComponent,
		BookingPageComponent,
		TermsOfServicePageComponent,
		PrivacyPolicyPageComponent,
		MyProfilePageComponent,
		PaymentPageComponent,
		VerifyResetOtpComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		CarouselModule,
		FormsModule,
		CommonModule,
		ReactiveFormsModule,
		NgxScrollTopModule,
		LightgalleryModule,
		HttpClientModule,
		MatButtonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSidenavModule,
		MatListModule,
		MatIconModule,
		MatIconModule,
		NgbModule,
		ImageCropperModule,
		NgxPaginationModule,
		NgChartsModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}