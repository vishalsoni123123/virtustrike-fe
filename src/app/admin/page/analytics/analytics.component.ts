import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService } from 'src/app/service/dashboard-service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadMaxPlayerChart();
    this.loadSlotBookingChart();
    this.loadRevenueChart();
    this.loadUserSummaryChart();
  }

  // Chart config (common)
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#444',
          font: { size: 14 }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#eee'
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    },
    scales: {
      x: {
        ticks: { color: '#888' },
        grid: { color: '#f0f0f0' }
      },
      y: {
        ticks: { color: '#888' },
        grid: { color: '#f0f0f0' }
      }
    }
  };

  // === Chart Data ===
  public maxPlayerChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public slotBookingChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public revenueChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public userSummaryChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  // Load charts
  loadMaxPlayerChart(): void {
    this.dashboardService.getMaxPlayerCount().subscribe({
      next: (res) => {
        const data = res.data;
        this.maxPlayerChartData = {
          labels: data.labels,
          datasets: [{
            data: data.series,
            label: 'Max Players',
            backgroundColor: '#4bc0c0',
            borderRadius: 10
          }]
        };
      }
    });
  }

  loadSlotBookingChart(): void {
    this.dashboardService.getSlotBookingAnalytics().subscribe({
      next: (res) => {
        const data = res.data;
        this.slotBookingChartData = {
          labels: data.labels,
          datasets: [{
            data: data.series,
            label: 'Slot Bookings',
            backgroundColor: '#3cba9f',
            borderRadius: 10
          }]
        };
      }
    });
  }

  loadRevenueChart(): void {
    this.dashboardService.getRevenueSummary().subscribe({
      next: (res) => {
        const data = res.data;
        this.revenueChartData = {
          labels: data.labels,
          datasets: [{
            data: data.series,
            label: 'Revenue ₹',
            backgroundColor: '#ffa600',
            borderRadius: 10
          }]
        };
      }
    });
  }

  loadUserSummaryChart(): void {
    this.dashboardService.getUserPlaySummary().subscribe({
      next: (res) => {
        const data = res.data;
        this.userSummaryChartData = {
          labels: ['Total Users', 'Played Users'],
          datasets: [{
            data: [data.totalUsers, data.playedUsers],
            backgroundColor: ['#42a5f5', '#ef5350'],
            hoverOffset: 8
          }]
        };
      }
    });
  }
}
