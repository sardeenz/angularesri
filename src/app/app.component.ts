import { HttpErrorResponse } from '@angular/common/http';
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
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  newweek: string;
  addressFinal = [];
  problemSidDisplay: string;
  public cands: Candidate;
  displayHttpError: string;
  arrayCnt: number;
  isOdd: boolean;
  isRecyclingWeek: string;
  isNotRecyclingWeek: boolean;
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
  newAddress: Observable<Array<Candidate>>;
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

  getWeek(arg0: any): any {
    this.newweek = arg0;
    console.log('getWeek = ', this.newweek);

    console.log('moment = ', moment().week());
    this.isOdd = (moment().week() % 2) === 1;
    console.log('actual week number = ', moment().week());
    console.log('isOdd = ', this.isOdd);
  }

  recycleDay() {

    console.log('this.addressFinal = ', this.addressFinal[0]);

    // this.items = this.myForm.get('callerAddress').valueChanges
    //   .debounceTime(300)
    //   .distinctUntilChanged()
    //   .switchMap((x) => this.filteraddressService.getGeometry(x));

    // this.subscription = this.items.subscribe(
    //   x => x.map(res => this.arrayCnt = this.testCandidates.push(res),
    //     this.coords = this.coordsArray[this.arrayCnt]),
    //   error => this.anyErrors = true,
    //   () => console.log('finished items subscription')
    // );

    console.log('this.testCandidates', this.testCandidates);
    // if address from testCandidates exactly matches address from for, get coordindates and pass them to get trash day.

    for (const addressEntry in this.testCandidates) {
      if (this.testCandidates[addressEntry].address === this.myForm.get('callerAddress').value) {
        console.log('we have a match on address, heres its coordinates', this.testCandidates[addressEntry].location);
        console.log('addressEntry', addressEntry);
        this.geocodeService.getTrashDay(this.testCandidates[addressEntry].location).subscribe(
          data => { this.collectionareas = data; 
            for (var i=0; i < this.collectionareas.features.length; i++){
              if(this.collectionareas.features[i].attributes.WEEK){
                  this.newweek = this.collectionareas.features[i].attributes.WEEK;
                  console.log('newweek in if = ', this.newweek);
                  this.getWeek(this.newweek);
              }
          }
            // this.getWeek(this.collectionareas.features[0].attributes.WEEK); 
            
          },
          err => console.error(err),
          () => {
            console.log('done inside getTrashday call', this.week = this.collectionareas.features[0].attributes.WEEK);

            if (this.newweek === 'A' && this.isOdd) {
              this.isRecyclingWeek = 'This week is your Recycling week.';
              this.isNotRecyclingWeek = false;
            } else if (this.newweek === 'B' && !this.isOdd){
              this.isRecyclingWeek = 'This week is your Recycling week.';
              this.isNotRecyclingWeek = false;
            } else {
              this.isRecyclingWeek = 'This week is not your Recycling week.';
              this.isNotRecyclingWeek = true;
            }

          });
      } else {
        // go get coords and trashday
        // this.newAddress = this.filteraddressService.getGeometry(this.myForm.get('callerAddress'));
        // console.log('newAddress = ', this.newAddress);

        // actually using 1st returned coords anyways
        // console.log('inside else!!!!!!!!!!!!!!');
        //this.testCandidates.splice(0);

        // this.items = this.myForm.get('callerAddress').valueChanges
        // .debounceTime(300)
        // .distinctUntilChanged()
        // .switchMap((x) => this.filteraddressService.getGeometry(x));
  
        //  () => this.addressFinal = this.myForm.get('callerAddress').value);
      // this.subscription = this.items.subscribe(
      //   x => x.map(res => this.arrayCnt = this.testCandidates.push(res),
      //     this.coords = this.coordsArray[this.arrayCnt]),
      //   error => this.anyErrors = true,
      //   () => console.log('finished items subscription')
      // );


        this.geocodeService.getTrashDay(this.testCandidates[addressEntry].location).subscribe(
          data => { this.collectionareas = data; 
             for (var i=0; i < this.collectionareas.features.length; i++) {
              if (this.collectionareas.features[i].attributes.WEEK) {
                  this.newweek = this.collectionareas.features[i].attributes.WEEK;
                  console.log('newweek in else = ', this.newweek);
                  this.getWeek(this.newweek);
              }
           }
          
            //this.getWeek(this.collectionareas.features[0].attributes.WEEK); 
          
          },
          err => console.error(err),
          () => {
            // console.log('done inside getTrashday call', this.week = this.collectionareas.features[0].attributes.WEEK);

            if (this.newweek === 'A' && this.isOdd) {
              this.isRecyclingWeek = 'This week is your Recycling week.';
              this.isNotRecyclingWeek = false;
            } else if (this.newweek === 'B' && !this.isOdd){
              this.isRecyclingWeek = 'This week is your Recycling week.';
              this.isNotRecyclingWeek = true;
            } else {
              this.isRecyclingWeek = 'This week is not your Recycling week.';
              this.isNotRecyclingWeek = true;
            }

          });
       }
    } 
  }

  save(model: User, isValid: boolean) {
    this.problemSidDisplay = this.myForm.controls.problemSid.value;
    if (this.problemSidDisplay === '263551') {
      this.problemSidDisplay = 'Garbage'
    } else if (this.problemSidDisplay === '263552') {
      this.problemSidDisplay = 'Recycling'
    } else if (this.problemSidDisplay === '263553') {
      this.problemSidDisplay = 'Yard Waste'
    }

    model.address = this.myForm.get('callerAddress').value;
    this.submitted = true;
    this.ckSrStatussubmitted = true;

    // testing 123
    // this._servicerequestService.testGateway().subscribe(
    //   data => this.authResponse = data,
    //   (err: HttpErrorResponse) => {
    //     if (err.error instanceof Error) {
    //       // A client-side or network error occurred. Handle it accordingly.
    //       console.log('An error occurred:', err.error.message);
    //       this.displayHttpError = 'There was an error message on the client side, please check your connectivity and try again later.';
    //     } else {
    //       // The backend returned an unsuccessful response code.
    //       // The response body may contain clues as to what went wrong,
    //       this.displayHttpError = 'There was an error message from the server. Please try again later.';
    //       console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
    //     }
    //   },
    //   () => {
    //     this.isDone = true;
    //     this.ckSrStatussubmitted = true;
    //     if (this.authResponse.requestId === '') {
    //       console.log('no ServiceRequest ID was returned');
    //     }
    //     console.log('this response is ', this.authResponse);
    //   }
    // );

    this._servicerequestService.createServiceRequest(model).subscribe(
      data => this.authResponse = data,
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', err.error.message);
          this.displayHttpError = 'There was an error message on the client side, please check your connectivity and try again later.';
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          this.displayHttpError = 'There was an error message from the server. Please try again later.';
          console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        }
      },
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
        console.log('sr status from Cityworks = ', this.authResponse.Value);
      });
  }

  ngOnInit() {
    const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const PHONE_REGEX = /^\(?(\d{3})\)?[ .-]?(\d{3})[ .-]?(\d{4})$/;
    this.myForm = this._fb.group({
      problemSid: [this.problemSids[0].value],
      callerFirstName: [''],
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
    this.testCandidates.splice(0);
    console.log('this.testCandidates CHF = ', this.testCandidates.length);
    // ProTip: variable 'x' below is whatever is passed to the observable of valuechanges
    this.items = this.myForm.get('callerAddress').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((x) => this.filteraddressService.getGeometry(x));

      //  () => this.addressFinal = this.myForm.get('callerAddress').value);
    this.subscription = this.items.subscribe(
      x => x.map(res => this.arrayCnt = this.testCandidates.push(res),
        this.coords = this.coordsArray[this.arrayCnt]),
      error => this.anyErrors = true,
      () => console.log('finished items subscription')
    );
    this.testCandidates.splice(0);
    console.log('this.testCandidates CHF = ', this.testCandidates.length);
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


