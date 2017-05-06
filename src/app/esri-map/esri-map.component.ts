import { GeocodeService } from '../geocode.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';

// also import the "angular2-esri-loader" to be able to load JSAPI modules
import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  public data: any;
  maploaded: boolean = false;

  public mymap: any;

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: __esri.MapView;
  public sceneView: __esri.SceneView;

  public graphic: __esri.Graphic;
  public point: __esri.Point;
  public markerSymbol: __esri.SimpleMarkerSymbol;
  public graphicsLayer: __esri.GraphicsLayer;


  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService, private geocodeService: GeocodeService
  ) { }

  public gotoView(address) {
    this.geocodeService.getGeometry(address).subscribe(data => this.data = data,
      err => console.error(err),
      () => this.setMarker(this.data));
      //() => this.buildMap());

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
        'esri/views/SceneView',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/Graphic',
        'esri/layers/GraphicsLayer'
        ]).then(([
        Map,
        SceneView,
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
        this.sceneView = new SceneView(mapViewProperties);
        this.maploaded = this.esriLoader.isLoaded();
        console.log(this.maploaded);
      });
    });

  }

  public setMarker(data) {

    this.sceneView.goTo({center: [this.data.features[0].geometry.x, this.data.features[0].geometry.y],
        zoom: 17
      });

        this.esriLoader.require(['esri/Map','esri/layers/GraphicsLayer','esri/geometry/Point','esri/symbols/SimpleMarkerSymbol','esri/Graphic'], 
        (Map, GraphicsLayer, Point, SimpleMarkerSymbol, Graphic) => {
            console.log('x = ',this.data.features[0].geometry.x);
           this.point = new Point({
              x: this.data.features[0].geometry.x,
              y: this.data.features[0].geometry.y,
              z: 1010
            });
            this.graphic = new Graphic({
              geometry: this.point,
              symbol: this.markerSymbol
            });
            this.markerSymbol = new SimpleMarkerSymbol({
              color: [226, 119, 40],
              outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 2
              }
            });
            this.mymap = new Map();

        this.graphicsLayer = new GraphicsLayer();
        this.mymap.add(this.graphicsLayer);
        
        this.maploaded = this.esriLoader.isLoaded();
        console.log(this.maploaded);

        console.log('this.graphic', JSON.stringify(this.graphic));
        this.graphicsLayer.add(this.graphic);

        });

        
  }

}