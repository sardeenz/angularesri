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

  // public addressSelected(address) {
  //       if (address) {
  //           view.goTo({
  //               center: [address.geometry.x, address.geometry.y],
  //               zoom: 17
  //           });
  //           self.data.address = self.selectedAddress.attributes.ADDRESS;
  //           self.addAddressToMap(address);
  //       }
  //   };  

  ngOnInit() {
      this.user = {
        firstname: '',
        lastname: '',
        address: '',
        phone: '',
        requestType: [this.requestType[0].value],
        comments: ''
    };
  }

}
