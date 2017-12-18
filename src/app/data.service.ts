import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Data } from './data';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient
  ) { }

  generateSchedule(data: Data): Observable<Data>{
    // TODO
    return null;
  }
}
