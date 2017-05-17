import { GeocodeService } from './geocode.service';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { ServicerequestService } from './servicerequest.service';
import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';
import { User } from './user';
import { EsriMapComponent } from 'app/esri-map/esri-map.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import {MdDialog, MdDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  myControl = new FormControl();

   addressOptions = [];
   filteredOptions: Observable<string[]>;

  map: any;
  public authResponse;
  public isDone;
  public submitted = false;
  public user: User;
  public data;
  public result;

  public problemSid = [
    { value: 'garbage', display: 'Garbage' },
    { value: 'recycling', display: 'Recycling' },
    { value: 'yard', display: 'Yard Waste' },
];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private _dialog: MdDialog,
  private _servicerequestService: ServicerequestService, private geocodeService: GeocodeService) {iconRegistry.addSvgIcon(
        'city_seal',
        sanitizer.bypassSecurityTrustResourceUrl('assets/favicon.svg')); }

  onSubmit() { this.submitted = true; }

  zoomToMap() {
    console.log('inside zoomToMap');
  }

  save() {

    if (this.user.problemSid === 'garbage') {
        this.user.problemSid = '263551';
    } else if (this.user.problemSid === 'recycling') {
        this.user.problemSid = '263552';
    } else if (this.user.problemSid === 'yard') {
        this.user.problemSid = '263553';
    }

    this.submitted = true;
    this.isDone = false;
        console.log('user.address = ', this.user);
        this.esriMapComponent.gotoView(this.user.address);
        this._servicerequestService.createServiceRequest(this.user).subscribe(
          data => this.authResponse = data,
          err => console.error(err),
          // () => console.log('this token is ', this.authResponse.Value.Token)
          () => this.isDone = true
        );
    }

  ngOnInit() {
      this.user = {
        callerFirstName: '',
        callerLastName: '',
        callerAddress: '',
        callerCity: '',
        callerState: '',
        callerZip: '',
        address: '',
        callerWorkPhone: '',
        callerEmail: '',
        // problemsid: this.problemsid[0].value,
        problemSid: '',
        callerComments: '',
        comments: 'created by SWS online customer web form',
        x: '',
        y: '',
        details: ''
    };

    this.filteredOptions = this.myControl.valueChanges.startWith(null).map(val => val ? this.filter(val) : this.addressOptions.slice());
  }

  filter(val: string): string[] {
      this.geocodeService.getGeometry(val).subscribe(result => this.result = result,
      err => console.error(err),
      () => this.addressOptions.push(this.result.features[0].attributes.ADDRESS));

      // console.log('result = ', JSON.stringify(this.result));
      return this.addressOptions.filter(addressOption => new RegExp(`^${val}`, 'gi').test(addressOption));
   }

  openDialog() {
    const dialogRef = this._dialog.open(DialogContentComponent);
  }

}


