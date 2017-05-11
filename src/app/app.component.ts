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

  map: any;
  public authResponse;
  public test = '213';
  public isDone;
  public submitted = false;


  public user: User;
  public requestType = [
    { value: 'garbage', display: 'Garbage' },
    { value: 'recycling', display: 'Recycling' },
    { value: 'yard', display: 'Yard Waste' },
];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private _dialog: MdDialog, 
  private _servicerequestService: ServicerequestService) {iconRegistry.addSvgIcon(
        'city_seal',
        sanitizer.bypassSecurityTrustResourceUrl('assets/favicon.svg')); }

  public save(isValid: boolean, f: User) {
    this.submitted = true;
    this.isDone = false;
        console.log('this is f and f = ', f);
        console.log('user.address = ', this.user.address);
        this.esriMapComponent.gotoView(this.user.address);

        console.log('before call to create service request');
        this._servicerequestService.createServiceRequest(this.user).subscribe(
          data => this.authResponse = data,
          err => console.error(err),
          //() => console.log('this token is ', this.authResponse.Value.Token)
          () => this.isDone = true
        );
        console.log('after call to create service request');
        //const dialogRef = this._dialog.open(DialogContentComponent);
    }

  ngOnInit() {
      this.user = {
        firstname: '',
        lastname: '',
        address: '1413 Scales St',
        phone: '',
        email: '',
        requestType: [this.requestType[0].value],
        comments: ''
    };
  }

}


