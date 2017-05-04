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

  // for JSAPI 4.x you can use the "any for TS types
  public mapView: any;
  public point: any;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  data;

  constructor(
    private esriLoader: EsriLoaderService, private geocodeService: GeocodeService
  ) { }

  public gotoView(address) {
    this.geocodeService.getGeometry(address).subscribe(data => this.data = data,
      err => console.error(err),
      //() => console.log('geoCode Service Result data = ', JSON.stringify(this.data.features[0].geometry.x)));
      () => console.log('geoCode Service Result data = ', JSON.stringify(this.data)));


    this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      this.esriLoader.loadModules([
        'esri/geometry/Point',
        'esri/geometry/SpatialReference'
      ]).then(([
        Point,
        SpatialReference
      ]) => {
        const mapProperties: any = {
          basemap: 'gray-vector'
        };

        // this.point = new Point({
        //   longitude: -84.3852995,
        //   latitude: 33.7678835,
        //   spatialReference: SpatialReference.WGS84,
        // });

        // this.options = {
        //   zoom: 1
        // };

        this.mapView.goTo({
          center: [-84.3852995, 33.7678835],
          //center: [this.data.features[0].geometry.x, this.data.features[0].geometry.y],
          zoom: 17
        })
        console.log('this.point', this.point);
        console.log('this.point', this.options);


      });
    });


  }

  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/SceneView',
        'esri/geometry/Point',
        'esri/geometry/SpatialReference'
      ]).then(([
        Map,
        SceneView,
        Point,
        SpatialReference
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

        // this.point = new Point({
        //         longitude: -84.3852995,
        //         latitude: 34.7678835,
        //         spatialReference: SpatialReference.WGS84
        //     });

        // this.options = {
        //         zoom: 5
        //     };

      });
    });
  }

}