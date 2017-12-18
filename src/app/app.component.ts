import { Component } from '@angular/core';
import {Data} from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(){
    
  }

  data = new Data();

  onSubmit(){
    console.log("submit!");
  }
}
