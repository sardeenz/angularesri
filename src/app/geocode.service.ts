import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class GeocodeService {

  // TODO: need to edit urlgeocoder to work
  private urlgeocoder = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=1413%20Scales%20st&City=null&State=null&ZIP=null';
  private url = 'https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query?returnGeometry=true&outSR=4326&geometryPrecision=5&f=json&orderByFields=ADDRESS&where=ADDRESSU like \'';

  constructor(private http: Http) { }

      getGeometry(address): Observable<string>  {
        return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res:Response) => res.json())
        .catch((error:any) => Observable.throw(error.json().error || console.log('Server error')));
      }
      // getGeometry(address): Observable<string>  {
      //   return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res:Response) => res.json())
      //   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
      // }
}
