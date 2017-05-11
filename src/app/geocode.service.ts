import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

@Injectable()
export class GeocodeService {
  private url = 'https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query?returnGeometry=true&outSR=4326&geometryPrecision=5&f=json&orderByFields=ADDRESS&where=ADDRESSU like \'';
  constructor(private http: Http) { }

      getGeometry(address): Observable<string>  {
        return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res:Response) => res.json());

      }
}
