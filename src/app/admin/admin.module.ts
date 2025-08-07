import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './page/customers/customers.component';
import { AddGameComponent } from './page/add-game/add-game.component';
import { GameListComponent } from './page/game-list/game-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxPaginationModule } from 'ngx-pagination';
import { EnquiryComponent } from './page/enquiry/enquiry-list.component';
import { BookingDetailsComponent } from './page/booking-details/booking-details.component';
import { BookingDetailViewComponent } from './page/booking-detail-view/booking-detail-view.component';
import { NgChartsModule } from 'ng2-charts';
import { AnalyticsComponent } from './page/analytics/analytics.component';
import { CalendarComponent } from './page/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CashBookingComponent } from './page/cash-booking/cash-booking.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    BookingDetailsComponent,
    BookingDetailViewComponent,
    CustomersComponent,
    AddGameComponent,
    CashBookingComponent,
    GameListComponent,
    EnquiryComponent,
    AnalyticsComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    AdminRoutingModule,
    NgxPaginationModule,
    NgChartsModule,
    ReactiveFormsModule,
    FullCalendarModule  
  ]
})
export class AdminModule { }