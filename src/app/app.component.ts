import { Component } from '@angular/core';
import { Data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  data = new Data();

  constructor() { }

  onSubmit() {
    console.log("submit!");
    window.location.href="/generate?"+
    "designation="+this.data.designation+"&"+
    "nIndividuals="+this.data.nIndividuals+"&"+
    "month="+this.data.month+"&"+
    "nAttendanceDuringWeek="+this.data.nAttendanceDuringWeek+"&"+
    "nAttendanceOnWeekends="+this.data.nAttendanceOnWeekends;
  }
}
