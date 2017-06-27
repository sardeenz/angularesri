import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Geodata } from './geodata';
import { Collectionareas } from './collectionareas';
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
  // templateUrl: './app.component.html',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  geocodedata: any;

  prjCompleteDate: Date;
  prjCompleteStr: string;
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  public myForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track on whether form is submitted
  //public events: any[] = []; // use later to display form changes

  cards: Array<number>;
  cardIndex: number;

  someAddress = '';
  srStatus = '';
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
    console.log('model is ', model, isValid);

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
      () => {
        this.srStatus = this.authResponse.Value.Status;
        if (this.srStatus === 'INPROG') {
          this.srStatus = 'In Progress';
        }
        this.prjCompleteDate = this.authResponse.Value.PrjCompleteDate;
        this.prjCompleteDate = new Date(this.authResponse.Value.PrjCompleteDate);

        this.prjCompleteStr = this.prjCompleteDate.toLocaleDateString("en-US", this.options);
        //this.prjCompleteDate = new Date(this.prjCompleteDate);
        console.log('sr status from Cityworks = ', this.authResponse.Value);
      });
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
    if (callerAddressChanges$.startWith(' n ')) {
      //https://stackoverflow.com/questions/34615425/how-to-watch-for-form-changes-in-angular-2/34629083
    }
    // let message = "";
    // let words = ["reducing", "is", "simple"];
    // for ( let i = 0; i < words.length; i++ ){
    //   message = message + ' ' + words[i];
    // }
    let words2 = ["reducing2", "is", "simple"].reduce((a,b) => a + ','+ b);
    console.log('message = ', words2);

    // this.filteredOptions = callerAddressChanges$.startWith(null).map(val => val ? this.filter(val) : this.addressOptions.slice());

    // callerAddressChanges$.map(val => );
    //.filter( value => value === '720 n' ).map(v => console.log('v = ',v));

    this.filteredOptions = callerAddressChanges$
    .startWith(null)
    //.debounceTime(200)
      .scan(() => {
        this.someAddress = this.myForm.get('callerAddress').value;
        // if (this.someAddress.includes(' n ')) {
        //   this.someAddress = this.someAddress.replace(' n ', ' North ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' N ')) {
        //   this.someAddress = this.someAddress.replace(' N ', ' North ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' s ')) {
        //   this.someAddress = this.someAddress.replace(' s ', ' South ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' S ')) {
        //   this.someAddress = this.someAddress.replace(' S ', ' South ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' e ')) {
        //   this.someAddress = this.someAddress.replace(' e ', ' East ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' E ')) {
        //   this.someAddress = this.someAddress.replace(' E ', ' East ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' w ')) {
        //   this.someAddress = this.someAddress.replace(' w ', ' West ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
        // if (this.someAddress.includes(' W ')) {
        //   this.someAddress = this.someAddress.replace(' W ', ' West ');
        //   this.myForm.controls['callerAddress'].setValue(this.someAddress);
        // }
      }
      )
      .map(val => this.someAddress ? this.filter(this.someAddress) : console.log('inside slice', this.someAddress));

    // this.filteredOptions = callerAddressChanges$.startWith(null).debounceTime(100).filter(x => this.myForm.get('callerAddress').value === '7')
    // .map(val => val ? this.filter(val) : console.log('inside slice'));
  }

  //   filterGeo(val: string): string[] {
  //   this.geocodeService.getGeometryGeoCoder(val).subscribe(geocodedata => this.geocodedata = geocodedata,
  //     err => console.error(err),
  //     () => {
  //       this.addressOptions.splice(0, 1);
  //       this.addressOptions.push(this.geocodedata.candidates[0].address);
  //     });

  //   console.log('this.addressOptions = ', this.addressOptions);
  //   return this.addressOptions.filter(addressOption => new RegExp(`^${this.addressOptions}`, 'gi').test(addressOption));
  // }

  filter(val: string): string[] {
    this.geocodeService.getGeometry(val).subscribe(geodata => this.geodata = geodata,
      err => console.error(err),
      () => {
        this.addressOptions.splice(0, 1);
        this.addressOptions.push(this.geodata.features[0].attributes.ADDRESS);
      });

    console.log('this.addressOptions = ', this.addressOptions);
    return this.addressOptions.filter(addressOption => new RegExp(`^${this.addressOptions}`, 'gi').test(addressOption));
  }

  getPreviousCard() {
    //this.cards.push(this.cards.length + 1);
    this.cardIndex -= 1;
    console.log('this previous cards full array', this.cardIndex);
  }

  getNextCard() {
    //this.cards.push(this.cards.length + 1);
    this.cardIndex += 1;
    console.log('this cards full array', this.cardIndex);
  }

  openDialog(page: string) {
    if (page === 'about') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    } else if (page === 'help') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    }
  }
}


