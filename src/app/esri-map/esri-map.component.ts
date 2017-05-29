import { Collectionareas } from '../collectionareas';
import { Geodata } from '../geodata';
import { GeocodeService } from '../geocode.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  geodata: Geodata;
  maploaded: boolean = false;
  collectionareas: Collectionareas;
  day: string = '';
  geojson;
  geojsonArr: string[];
  today: any;
  
  public mymap: any;

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: __esri.MapView;
  public pointGraphic: __esri.Graphic;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService, private geocodeService: GeocodeService
  ) { }

  public gotoView(address) {

    let start = new Date(this.today);
    console.log('start = ', start);
    //  let isOdd = (moment().week() % 2) == 1;
    //             if (response === 'B' && isOdd) {
    //                 console.log(":tell", 'No this is not your recycling week');
    //             }
    //              console.log(":tell", "Yes this is your recycing week");

    this.geocodeService.getGeometry(address).subscribe(geodata => this.geodata = geodata,
      err => console.error(err),
      () => {
        this.setMarker(this.geodata);
        this.isInsideCity(this.geodata);
        this.geocodeService.getTrashDay(this.geodata).subscribe(collectionarea => this.collectionareas = collectionarea,
      err => console.error(err),
      () => console.log('this.day inside service call = ', this.day = this.collectionareas.features[0].attributes.DAY));
      }
      );
      console.log('this.day outside service call= ', this.collectionareas);
  }

  public ngOnInit() {
    return this.buildMap();
  }

  public buildMap() {

    return this.esriLoader.load({
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/MapView',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/Graphic',
        'esri/layers/GraphicsLayer'
        ]).then(([
        Map,
        MapView,
        Point,
        SimpleMarkerSymbol,
        Graphic,
        GraphicsLayer
      ]) => {
        const mapProperties: __esri.MapProperties = {
          basemap: 'gray-vector'
        };

        const map = new Map(mapProperties);
        const mapViewProperties: __esri.MapViewProperties = {
          container: this.mapViewEl.nativeElement,
          center: [-78.65, 35.8],
          zoom: 12,
          map
        };
        this.mymap = map;
        this.mapView = new MapView(mapViewProperties);
        this.maploaded = this.esriLoader.isLoaded();
        console.log(this.maploaded);
      });
    });

  }

  public setMarker(data) {

    console.log('this.data from address search= ', this.geodata);

    this.mapView.goTo({center: [this.geodata.features[0].geometry.x, this.geodata.features[0].geometry.y],
        zoom: 17
      });

        this.esriLoader.require(['esri/Map','esri/layers/GraphicsLayer','esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol','esri/Graphic'],
        (Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic) => {
            console.log('x = ',this.geodata.features[0].geometry.x);
            console.log('y = ',this.geodata.features[0].geometry.y);
            this.markerSymbol = new SimpleMarkerSymbol({
              color: [226, 119, 40],
              outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 2
              }
            });
            this.pointGraphic = new Graphic({
              geometry: new Point({
                        longitude: this.geodata.features[0].geometry.x,
                        latitude: this.geodata.features[0].geometry.y
                    })
            });

            this.pointGraphic.symbol = this.markerSymbol;
            this.mapView.graphics.removeAll();
            this.mapView.graphics.add(this.pointGraphic);
        });
  }

  public isInsideCity(geometry): boolean {
      this.geocodeService.cityLimits().subscribe(geojson => this.geojson = geojson,
      err => console.error(err),
      () => {
        // TODO: create nested loop to find matching coordinates and return true/false
        console.log('hello geojson', this.geojson.features[0].geometry.coordinates[0]);

      });

      return true;
  }

}