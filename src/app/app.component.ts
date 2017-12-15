import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(){
    
  }

  getCurrentMonth(){
    var date = new Date();
    return date.getFullYear()+"-"+(date.getMonth()+1);
  }
}
