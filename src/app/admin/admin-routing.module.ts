import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './page/customers/customers.component';
import { AddGameComponent } from './page/add-game/add-game.component';
import { GameListComponent } from './page/game-list/game-list.component';
import { EnquiryComponent } from './page/enquiry/enquiry-list.component';
import { BookingDetailsComponent } from './page/booking-details/booking-details.component';
import { BookingDetailViewComponent } from './page/booking-detail-view/booking-detail-view.component';
import { AnalyticsComponent } from './page/analytics/analytics.component';
import { CalendarComponent } from './page/calendar/calendar.component';
import { CashBookingComponent } from './page/cash-booking/cash-booking.component';
import { AdminProfileComponent } from './page/admin-profile/admin-profile.component';


// Admin-Routing
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {path:'admin-profile',component:AdminProfileComponent},
      { path: 'booking/details/list', component: BookingDetailsComponent },
      { path: 'booking-details/:id', component: BookingDetailViewComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'games/add', component: AddGameComponent },
      { path: 'games/booking', component: CashBookingComponent},
      { path: 'games/list', component: GameListComponent },
      { path: 'enquiry/list', component: EnquiryComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }