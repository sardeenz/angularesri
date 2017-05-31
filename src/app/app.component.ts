import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Geodata } from './geodata';
import { Collectionareas } from './collectionareas';
import { GeocodeService } from './geocode.service';
import { Observable } from 'rxjs/Rx';
import { FormControl } from '@angular/forms';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { ServicerequestService } from './servicerequest.service';
import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';
import {User } from './user';
import { EsriMapComponent } from 'app/esri-map/esri-map.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

@Component({
  selector: 'app-root',
  // templateUrl: './app.component.html',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public myForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted
  //public events: any[] = []; // use later to display form changes

  cards: Array<number>;
  cardIndex: number;

  requestId: any;
  myControl = new FormControl();
  addressOptions = [];
  filteredOptions: Observable<string[]>;
  map: any;
  public authResponse;
  public isDone;
  user: User;
  public data;
   //geodata = new Geodata();
  geodata: Geodata;
  collectionareas: Collectionareas;
  //srStatus: string;

  public problemSids = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private _dialog: MdDialog,
    private _servicerequestService: ServicerequestService, private geocodeService: GeocodeService, private _fb: FormBuilder) {
    iconRegistry.addSvgIcon(
      'city_seal',
      sanitizer.bypassSecurityTrustResourceUrl('assets/favicon.svg'));
  }

  zoomToMap() {

    console.log('inside zoomToMap');
    //this.esriMapComponent.gotoView(this.user.address);
    this.esriMapComponent.gotoView(this.myForm.get('callerAddress').value);
  }

  save(model: User, isValid: boolean) {

    // delete model.srStatus;

    // move callerAddress to address to display in Cityworks in both fields
    model.address = this.myForm.get('callerAddress').value;

    this.isDone = false;
    this.submitted = true; // set form submit to true

    // check if model is valid
    // if valid, call API to save customer
    console.log('model is ',model, isValid);

    console.log('stringified model', JSON.stringify(model));

    this._servicerequestService.createServiceRequest(model).subscribe(
      data => this.authResponse = data,
      err => console.error(err),
      () => {
        this.isDone = true;
        if (this.authResponse.requestId === "") {
          console.log('no ServiceRequest ID was returned');
        }
        console.log('this response is ', this.authResponse);
      }
    );
  }

  checkSRStatus() {
    console.log('inside check status', this.requestId);
    this.submitted = true;
    this._servicerequestService.getServiceRequest(this.requestId).subscribe(data => this.authResponse = data,
      err => console.error(err),
      () => console.log('sr status from Cityworks = ', this.authResponse));
  }

  ngOnInit() {
    this.myForm = this._fb.group({
      problemSid: [this.problemSids[0].value],
      callerFirstName: [''],
      callerLastName: ['', [<any>Validators.required]],
      callerAddress: ['', <any>Validators.required],
      address: [''],
      callerCity: ['Raleigh'],
      callerState: ['NC'],
      callerZip: [''],
      callerEmail: ['', <any>Validators.email],
      callerWorkPhone: [''],
      comments: ['']
    });

    this.cards = [0];
    this.cardIndex = 0;

    const callerAddressChanges$ = this.myForm.get('callerAddress').valueChanges;
    this.filteredOptions = callerAddressChanges$.startWith(null).map(val => val ? this.filter(val) : this.addressOptions.slice());
  }

  getNextCard(){
    //this.cards.push(this.cards.length + 1);
    this.cardIndex += 1;
    console.log('this cards full array', this.cardIndex);
  }

  filter(val: string): string[] {

    // TODO: use geodata instead of results
    this.geocodeService.getGeometry(val).subscribe(geodata => this.geodata = geodata,
      err => console.error(err),
      () => {
        this.addressOptions.splice(0, 1);
        this.addressOptions.push(this.geodata.features[0].attributes.ADDRESS);
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


