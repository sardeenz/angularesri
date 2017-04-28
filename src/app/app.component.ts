import { Component, OnInit } from '@angular/core';
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public user: User;
  public requestType = [
    { value: 'garbage', display: 'Garbage' },
    { value: 'recycling', display: 'Recycling' },
    { value: 'yard', display: 'Yard Waste' },
];

  public save(isValid: boolean, f: User) {
        console.log(f);
    }

  ngOnInit() {
      this.user = {
        firstname: '',
        lastname: '',
        address: '',
        phone: '',
        requestType: [this.requestType[0].value],
        comments: ''
    }
    }

}
