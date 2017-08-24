import { ValidateFn } from 'codelyzer/walkerFactory/walkerFn';
import { FilteraddressService } from './filteraddress.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Candidate, Geocode } from './geocode';
// import { Geodata } from './geodata';
import { Collectionareas } from './collectionareas';
import { GeocodeService } from './geocode.service';
import { Observable } from 'rxjs/Rx';
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
  ckSrStatussubmitted: boolean;
  geocodedata: any;

  prjCompleteDate: Date;
  prjCompleteStr: string;
  options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  public myForm: FormGroup; // our model driven form
  public subForm: FormGroup; // tiny model driven form
  submitted: boolean = false; // keep track on whether form is submitted
  isDone: boolean = false;
  ckStatus: boolean = false;

  items: Observable<Array<Candidate>>;
  private anyErrors: boolean;
  public subscription;
  public coords;

  cards: Array<number>;
  cardIndex: number;

  someAddress = '';
  srStatus = '';
  requestId: any;
  myControl = new FormControl();
  addressOptions = [];
  //filteredOptions: Observable<string[]>;
  filteredOptions: any;

  map: any;
  public authResponse;
  user: User;
  public data;
  //geodata = new Geodata();
  //geodata: Geodata;
  collectionareas: Collectionareas;

  public problemSids = [
    { value: '263551', display: 'Garbage' },
    { value: '263552', display: 'Recycling' },
    { value: '263553', display: 'Yard Waste' },
  ];

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private _dialog: MdDialog,
    private _servicerequestService: ServicerequestService, private geocodeService: GeocodeService, private _fb: FormBuilder,
    private filteraddressService: FilteraddressService) {
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

    // move callerAddress to address to display in Cityworks in both fields
    model.address = this.myForm.get('callerAddress').value;
    this.submitted = true;
    this.ckSrStatussubmitted = true;
    
    // check if model is valid
    // if valid, call API to save customer
    console.log('model is ', model, isValid);

    console.log('stringified model', JSON.stringify(model));

    this._servicerequestService.createServiceRequest(model).subscribe(
      data => this.authResponse = data,
      err => console.error(err),
      () => {
        this.isDone = true;
        this.ckSrStatussubmitted = true;        
        if (this.authResponse.requestId === '') {
          console.log('no ServiceRequest ID was returned');
        }
        console.log('this response is ', this.authResponse);
      }
    );
  }

  checkSRStatus() {
    console.log('inside check status', this.requestId);
    console.log('inside check status!!!!!!!!', this.subForm.get('srInputId'));
    this.ckSrStatussubmitted = true;
    // this._servicerequestService.getServiceRequest(this.requestId).subscribe(data => this.authResponse = data,
    this._servicerequestService.getServiceRequest(this.subForm.get('srInputId').value).subscribe(data => this.authResponse = data,
        
      err => console.error(err),
      () => {
        this.ckStatus = true;
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
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const PHONE_REGEX = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    this.myForm = this._fb.group({
      problemSid: [this.problemSids[0].value],
      callerFirstName: [''],
      // callerLastName: ['', [<any>Validators.required]],
      callerAddress: ['', <any>Validators.required],
      address: [''],
      callerCity: ['Raleigh'],
      callerState: ['NC'],
      callerZip: [''],
      callerEmail: ['', <any>Validators.pattern(EMAIL_REGEX)],
      callerWorkPhone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]],
      comments: ['']
    });

    this.subForm = this._fb.group({
      srInputId: ['', [<any>Validators.maxLength(6), <any>Validators.minLength(6), <any>Validators.required]]
    });
    
    // this.cards = [0];
    // this.cardIndex = 0;

    // this.filteredOptions = this.myForm.get('callerAddress').valueChanges.startWith(null)
    // .map(val => val ? this.filter(val) : console.log('inside slice', val));

    // variable 'x' below is whatever is passed to the observable of valuechanges
    this.items = this.myForm.get('callerAddress').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((x) => this.filteraddressService.getGeometry(x));

    // this is getting the last set of coordinates I think.
    this.subscription = this.items.subscribe(
      x => x.map(res => console.log('x.map = ', this.coords = res.location)),
      error => this.anyErrors = true,
      () => console.log('finished items subscription')
    );


  }

  filter(val: string): string[] {
    // this.geocodeService.getGeometry(val).subscribe(geocodedata => this.geocodedata = geocodedata,
    this.geocodeService.getGeometry(val).subscribe(geocodedata => this.geocodedata = geocodedata,
      err => console.error(err),
      () => {
        // add a splice here or something to remove stuff from addressOptions array
        console.log('val = ', val);
        //this.addressOptions.splice(0,1);
        for (val in this.geocodedata.candidates) {
          if (this.geocodedata.candidates[val].attributes.Loc_name == "WakeStreets") {
            this.addressOptions.push(this.geocodedata.candidates[val].address);
          }
        }
      });

    console.log('this.addressOptions = ', this.addressOptions);
    return this.addressOptions.filter(addressOption => new RegExp(`^${val}`, 'gi').test(addressOption));
  }

  // displayFn(val: string): string {
  //     return val;
  //  }

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
    } else if (page === 'status') {
      const dialogRef = this._dialog.open(DialogContentComponent);
    }
  }
}


