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
  public isDone;
  public submitted = false;
  public user: User;
  public options = ['test','test2'];

  public problemsid = [
    { value: 'garbage', display: 'Garbage' },
    { value: 'recycling', display: 'Recycling' },
    { value: 'yard', display: 'Yard Waste' },
];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private _dialog: MdDialog,
  private _servicerequestService: ServicerequestService) {iconRegistry.addSvgIcon(
        'city_seal',
        sanitizer.bypassSecurityTrustResourceUrl('assets/favicon.svg')); }

  onSubmit() { this.submitted = true; }

  public save() {

    if (this.user.problemsid === 'garbage') {
        this.user.problemsid = '263551';
    } else if (this.user.problemsid === 'recycling') {
        this.user.problemsid = '263552';
    } else if (this.user.problemsid === 'yard') {
        this.user.problemsid = '263553';
    }

    this.submitted = true;
    this.isDone = false;
        console.log('user.address = ', this.user);
        this.esriMapComponent.gotoView(this.user.address);
        this._servicerequestService.createServiceRequest(this.user).subscribe(
          data => this.authResponse = data,
          err => console.error(err),
          //() => console.log('this token is ', this.authResponse.Value.Token)
          () => this.isDone = true
        );
    }

  ngOnInit() {
      this.user = {
        callerfirstname: '',
        callerlastname: '',
        address: '',
        callerWorkPhone: '',
        callerEmail: '',
        //problemsid: this.problemsid[0].value,
        problemsid: 'garbage',
        callerComments: '',
        comments: 'created by SWS online customer web form'
    };
  }

  openDialog() {
    const dialogRef = this._dialog.open(DialogContentComponent);
  }

}


