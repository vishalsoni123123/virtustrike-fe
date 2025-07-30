import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  selectedDate: string = '';
  eventText: string = '';
  events: { [key: string]: string } = {};
  showForm: boolean = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('events');
    if (saved) {
      this.events = JSON.parse(saved);
    }
  }

  saveEvent(): void {
    if (this.selectedDate && this.eventText.trim()) {
      this.events[this.selectedDate] = this.eventText.trim();
      localStorage.setItem('events', JSON.stringify(this.events));
      this.eventText = '';
      this.selectedDate = '';
      this.showForm = false;
      alert('Event saved!');
    } else {
      alert('Please select a date and enter event text.');
    }
  }

  get allEventDates(): string[] {
    return Object.keys(this.events).sort();
  }
}