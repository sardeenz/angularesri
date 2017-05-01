import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from './user';
import { EsriMapComponent } from "app/esri-map/esri-map.component";
import { EsriLoaderService } from "angular2-esri-loader";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild(EsriMapComponent) esriMapComponent: EsriMapComponent;
  // @ViewChild('map') mapEl: ElementRef;
  //   @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  //@ViewChild(EsriLoaderService) esriLoaderService: EsriLoaderService;

  
  map: any;

  
  public user: User;
  public requestType = [
    { value: 'garbage', display: 'Garbage' },
    { value: 'recycling', display: 'Recycling' },
    { value: 'yard', display: 'Yard Waste' },
];

  public save(isValid: boolean, f: User) {
        console.log(f);
        this.esriMapComponent.gotoView();
            //this.map = this.mapViewEl.nativeElement;
            // console.log("is loaded?", this.esriLoaderService);
            
            

    }


  ngOnInit() {
      this.user = {
        firstname: '',
        lastname: '',
        address: '1413 Scales St. Raleigh, NC 27608',
        phone: '',
        requestType: [this.requestType[0].value],
        comments: ''
    };
  }

}
