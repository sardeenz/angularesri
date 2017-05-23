import { Collectionareas } from './collectionareas';
import { Geodata } from './geodata';
import { GeocodeService } from './geocode.service';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { ServicerequestService } from './servicerequest.service';
import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';
import { User } from './user';
import { EsriMapComponent } from 'app/esri-map/esri-map.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  requestId: any;
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
  geodata: Geodata;
  collectionareas: Collectionareas;
  day: string;

  public problemSid = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private _dialog: MdDialog,
    private _servicerequestService: ServicerequestService, private geocodeService: GeocodeService) {
    iconRegistry.addSvgIcon(
      'city_seal',
      sanitizer.bypassSecurityTrustResourceUrl('assets/favicon.svg'));
  }

  onSubmit() { this.submitted = true; }

  zoomToMap() {
    console.log('inside zoomToMap');
    this.esriMapComponent.gotoView(this.user.address);

    // TODO: call trashday service and show trashday 
    //       based on coords that should already be assigned to this.geodata model
    //console.log('geoCHAD', this.geodata.features[0].geometry.x);
    this.geocodeService.getTrashDay().subscribe(collectionareas => this.collectionareas = collectionareas,
      err => console.error(err),
      () => this.day = this.collectionareas.features[0].attributes.DAY);
      // () => console.log('this.data inside COLLECTIONAREAS', this.collectionareas.features[0].attributes.DAY));
      

  
  }

  save() {
    this.submitted = true;
    this.isDone = false;
    console.log('user.address = ', this.user);
    this._servicerequestService.createServiceRequest(this.user).subscribe(
      data => this.authResponse = data,
      err => console.error(err),
      () => {
        this.isDone = true
        if (this.authResponse.requestId === "") {
          console.log('no ServiceRequest ID was returned');
        }
        console.log('this response is ', this.authResponse);
      }
      //() => this.isDone = true
    );
  }

  checkSRStatus() {
    this._servicerequestService.getServiceRequest(this.requestId).subscribe(data => this.authResponse = data,
      err => console.error(err),
      // () => console.log('this token is ', this.authResponse.Value.Token)
      () => this.isDone = true);
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
      problemSid: this.problemSid[0].value,
      //problemSid: '',
      callerComments: '',
      comments: 'created by SWS online customer web form',
      x: '',
      y: '',
      details: '',
      city: '',
      state: 'NC',
      zip: ''
    };

    this.filteredOptions = this.myControl.valueChanges.startWith(null).map(val => val ? this.filter(val) : this.addressOptions.slice(0, 1));
  }

  filter(val: string): string[] {

    // TODO: use geodata instead of results
    this.geocodeService.getGeometry(val).subscribe(result => this.result = result,
      err => console.error(err),
      () => {
        this.addressOptions.splice(0, 1);
        this.addressOptions.push(this.result.features[0].attributes.ADDRESS)
      });

    console.log('this.addressOptions = ', this.addressOptions);
    return this.addressOptions.filter(addressOption => new RegExp(`^${val}`, 'gi').test(addressOption));
  }

  openDialog(page: string) {
    if (page === 'about') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    } else if (page === 'help') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    }
  }
}


