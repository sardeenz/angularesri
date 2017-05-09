import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';
import { User } from './user';
import { EsriMapComponent } from 'app/esri-map/esri-map.component';
import { EsriLoaderService } from 'angular2-esri-loader';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;

  map: any;

  public user: User;
  public requestType = [
    { value: 'garbage', display: 'Garbage' },
    { value: 'recycling', display: 'Recycling' },
    { value: 'yard', display: 'Yard Waste' },
];

  constructor(private _dialog: MdDialog) {}

  public save(isValid: boolean, f: User) {
        console.log(f);
        console.log(this.user.address);
        this.esriMapComponent.gotoView(this.user.address);
        let dialogRef = this._dialog.open(DialogContent);

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

@Component({
  template: `
    <p>This is a dialog</p>
    <p>
      <label>
        This is a text box inside of a dialog.
        <md-spinner color="accent" class="app-spinner"></md-spinner>
      </label>
    </p>
    <p> <button md-button (click)="dialogRef.close(name)">CLOSE</button> </p>
  `,
})
export class DialogContent {
  constructor(@Optional() public dialogRef: MdDialogRef<DialogContent>) { }
}
