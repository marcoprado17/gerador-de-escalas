import { Component } from '@angular/core';
import { Data } from './data';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private http: HttpClient) {

  }

  data = new Data();

  onSubmit() {
    // TODO: Download file
  }
}
