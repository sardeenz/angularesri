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
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public cands: Candidate;
  arrayCnt: number;
  isOdd: boolean;
  isRecyclingWeek: string;
  isNotRecyclingWeek: boolean;
  getWeek(arg0: any): any {
    this.week = arg0;
    console.log('getWeek = ', this.week);

    console.log('moment = ', moment().week());
    this.isOdd = (moment().week() % 2) === 1;
    console.log('isOdd = ', this.isOdd);
    if (this.week === 'B' && !this.isOdd) {
      this.isRecyclingWeek = 'This week is your Recycling week.';
    } else {
      this.isRecyclingWeek = 'This week is not your Recycling week.';
      this.isNotRecyclingWeek = true;
    }
  }

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

  testCandidates = [];

  items: Observable<Array<Candidate>>;
  private anyErrors: boolean;
  public subscription;
  public coords;
  public coordsArray = [];
  public week;

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

  recycleDay() {
    console.log('this.testCandidates',this.testCandidates);
    //if address from testCandidates exactly matches address from for, get coordindates and pass them to get trash day.
    //console.log('this.testCandidates',this.testCandidates.forEach(this.myForm.get('callerAddress').value === testCandidates.address));
    
    for (let addressEntry in this.testCandidates){
      console.log('addressEntry', addressEntry);
    }
    // take the final address that has been inputted and get only it's coordinates
    // shouldn't have to do this since we already have all coordinates
    // this.filteraddressService.getGeometry(this.myForm.get('callerAddress').value);

    console.log('count of array = ', this.arrayCnt);
    this.coords = this.coordsArray[this.arrayCnt];
    console.log('inside recycleDay - this.coords', this.coords);
    //let recycleAddress = this.myForm.get('callerAddress').value;
    this.geocodeService.getTrashDay(this.coords).subscribe(
      data => {this.collectionareas = data; this.getWeek(this.collectionareas.features[0].attributes.WEEK);},
      err => console.error(err),
      () => { console.log('done inside getTrashday call', this.week = this.collectionareas.features[0].attributes.WEEK);
      });
    

    console.log('inside collectionareas', this.week);

    // this.esriMapComponent.recycleDay(recycleAddress);
  }

  zoomToMap() {
    this.esriMapComponent.gotoView(this.myForm.get('callerAddress').value);
  }

  save(model: User, isValid: boolean) {
    model.address = this.myForm.get('callerAddress').value;
    this.submitted = true;
    this.ckSrStatussubmitted = true;
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
    this.ckSrStatussubmitted = true;
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
    // reset array 
    //this.candidate.slice(0,1);
    
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
      // x => x.map(res => this.arrayCnt = this.coordsArray.push(res.location), // also push the res.address from type Candidate
      x => x.map(res => this.arrayCnt = this.testCandidates.push(res), // also push the res.address from type Candidate
      
      this.coords = this.coordsArray[this.arrayCnt]), 
      // x => x.map(res => console.log('x.map = ', this.arrayCnt = this.coordsArray.push(res.location))),
      error => this.anyErrors = true,
      () => console.log('finished items subscription')
    );
    console.log('this.coordsArray = ', this.coordsArray);
    //this.coords = this.coordsArray[0];
    console.log('this.coords = ', this.coords);
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


