import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../service/dashboard-service';
import { UserService } from '../../service/user-service';

type PeriodType = 'today' | 'weekly' | 'monthly';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  Math = Math;
  activeDropdown: string | null = null;

  chartDataMap: Record<string, ChartConfiguration<'line'>> = {};

  chartLabels: Record<PeriodType, string[]> = {
    today: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM'],
    weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  };

  stats: {
    key: string;
    label: string;
    icon: string;
    value: number;
    change: number;
    color: string;
    period: PeriodType;
  }[] = [
      {
        key: 'users',
        label: 'Total Users',
        icon: 'bi-people-fill',
        value: 10,
        change: 5.2,
        color: '#3b82f6',
        period: 'monthly'
      },
      {
        key: 'enquiries',
        label: 'Total Enquiries',
        icon: 'bi-question-circle-fill',
        value: 5,
        change: 10.0,
        color: '#3b82f6',
        period: 'monthly'
      },
      {
        key: 'bookings',
        label: 'Total Bookings',
        icon: 'bi-calendar-check',
        value: 3,
        change: -2.5,
        color: '#f59e0b',
        period: 'monthly'
      },
      {
        key: 'revenue',
        label: 'Total Revenue',
        icon: 'bi-currency-rupee',
        value: 5000,
        change: 12.7,
        color: '#10b981',
        period: 'monthly'
      }
    ];

  registrations: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  selectedUser: any = null;

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadRecentRegistrations(this.currentPage);
    this.stats.forEach(stat => this.setChartData(stat));
  }

  toggleDropdown(key: string): void {
    this.activeDropdown = this.activeDropdown === key ? null : key;
  }

  filterData(type: string, range: PeriodType): void {
    const stat = this.stats.find(s => s.key === type);
    if (stat) {
      stat.period = range;
      this.setChartData(stat);
    }
    this.activeDropdown = null;
  }

  setChartData(stat: {
    key: string;
    label: string;
    icon: string;
    value: number;
    change: number;
    color: string;
    period: PeriodType;
  }): void {
    const labels = this.chartLabels[stat.period];
    const data = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 100));

    this.chartDataMap[stat.key] = this.getChartConfig({
      key: stat.key,
      label: stat.label,
      data,
      color: stat.color,
      period: stat.period
    });
  }

  getChartConfig(stat: {
    key: string;
    label: string;
    data: number[];
    color: string;
    period: PeriodType;
  }): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels: this.chartLabels[stat.period],
        datasets: [
          {
            label: stat.label,
            data: stat.data,
            borderColor: stat.color,
            backgroundColor: stat.color + '33',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: stat.color,
            pointBorderColor: '#fff',
            pointHoverRadius: 5,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        }
      }
    };
  }

  viewUser(user: any): void {
    this.selectedUser = user;
  }

  closeView(): void {
    this.selectedUser = null;
  }

  loadRecentRegistrations(page: number = 1): void {
    const pageNumber = page - 1;
    this.userService.findAllUsers(pageNumber, this.pageSize).subscribe(res => {
      this.registrations = res?.data || [];
      this.totalItems = res?.totalRecords || 0;
      this.currentPage = page;
    });
  }

  onPageChange(page: number): void {
    this.loadRecentRegistrations(page);
  }
}