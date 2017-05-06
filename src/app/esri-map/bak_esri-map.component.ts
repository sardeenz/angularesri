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
  options: { zoom: number; };

  public mapView: any;
  public point: any;
  public data: any;
  public markerSymbol: any;
  public graphic: any;
  public graphicsLayer: any;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(
    private esriLoader: EsriLoaderService, private geocodeService: GeocodeService
  ) { }

  public gotoView(address) {
    this.geocodeService.getGeometry(address).subscribe(data => this.data = data,
      err => console.error(err),
      () => this.centerMapAndDropPin());

  }
  public centerMapAndDropPin() {
      this.mapView.goTo({center: [this.data.features[0].geometry.x, this.data.features[0].geometry.y],
        zoom: 17
      });

      // this.point = {longitude: this.data.features[0].geometry.x, latitude: this.data.features[0].geometry.y  };
      // this.graphic = { geometry: this.point, symbol: this.markerSymbol, attributes: this.data.attributes };
      // //this.graphic.symbol = this.markerSymbol;

      // this.mapView.graphics.add(this.graphic);
      
      this.point = {
            x: -0.178,
            y: 52.48791,
            z: 1010
          };
      this.graphic = {
          geometry: this.point,
          symbol: this.markerSymbol,
          attributes:{},
          popupTemplate:null
        };

        // {"geometry":{"x":-0.178,"y":51.48791,"z":1010,"spatialReference":{"wkid":4326}},"symbol":{"type":"esriSMS","color":[226,119,40,255],"angle":0,"xoffset":0,"yoffset":0,"size":12,"style":"esriSMSCircle","outline":{"type":"esriSLS","color":[255,255,255,255],"width":2,"style":"esriSLSSolid"}},"attributes":{},"popupTemplate":null}

      this.graphicsLayer.add(this.graphic);



  }

  public ngOnInit() {
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
        const mapProperties: any = {
          basemap: 'gray-vector'
        };

        const map: any = new Map(mapProperties);

        const mapViewProperties: any = {
          // create the map view at the DOM element in this component
          container: this.mapViewEl.nativeElement,
          // supply additional options
          center: [-78.65, 35.8],
          zoom: 12,
          map // property shorthand for object literal
        };

        this.mapView = new SceneView(mapViewProperties);

        this.graphicsLayer = new GraphicsLayer();
        map.add(this.graphicsLayer);

        // this.markerSymbol = new SimpleMarkerSymbol({
        //             color: [226, 119, 40],
        //             outline: { // autocasts as new SimpleLineSymbol()
        //                 color: [255, 255, 255],
        //                 width: 2
        //             }
        //         });

            
        // this.point = new Point();
        // this.graphic = new Graphic();

        this.point = new Point({
            x: -0.178,
            y: 51.48791,
            z: 1010
          }),

          this.markerSymbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],

            outline: { // autocasts as new SimpleLineSymbol()
              color: [255, 255, 255],
              width: 2
            }
          });

        this.graphic = new Graphic({
          geometry: this.point,
          symbol: this.markerSymbol
        });
        console.log('this.graphic', JSON.stringify(this.graphic));
        this.graphicsLayer.add(this.graphic);


      });
    });
  }

}