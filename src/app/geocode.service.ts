import { Collectionareas } from './collectionareas';
import { Geodata } from './geodata';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class GeocodeService {

  geodata: Geodata;
  day: string = '';
  inside: boolean = true;

  // tslint:disable-next-line:max-line-length
  //private urlgeocoder = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=1413%20Scales%20st&City=null&State=null&ZIP=null';
    private urlgeocoder = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=';

  // tslint:disable-next-line:max-line-length
  // working example - https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query?returnGeometry=true&outSR=4326&geometryPrecision=5&f=json&orderByFields=ADDRESS&where=ADDRESSU%20like%20%27117%20HAYWOOD%20ST%%27
  private url = 'https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query?returnGeometry=true&outSR=4326&geometryPrecision=5&f=json&orderByFields=ADDRESS&where=ADDRESSU like \'';
  // tslint:disable-next-line:max-line-length
  private urlTrashDay = 'https://maps.raleighnc.gov/arcgis/rest/services/Services/PortalServices/MapServer/12/query?geometry=';
  constructor(private http: Http) { }

  // getGeometry(address): Observable<Geodata> {
  //   return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res: Response) => res.json())
  //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  // }

  getGeometry(address): Observable<Geodata> {
    console.log('geoAddress = ', encodeURI(this.urlgeocoder) + encodeURIComponent(address));
    return this.http.get(encodeURI(this.urlgeocoder) + encodeURIComponent(address)).map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  //getTrashDay(coords)
  urlparms = '&geometryType=esriGeometryPoint&inSR=4326&outFields=*&f=json';

  getTrashDay(data): Observable<Collectionareas> {
    let geometry = JSON.stringify(data.features[0].geometry);
    console.log('geometerryyyyURL = ', encodeURI(this.urlTrashDay + geometry + this.urlparms));
    return this.http.get(encodeURI(this.urlTrashDay + geometry + this.urlparms)).map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  cityLimits() {
    return this.http.request('./assets/city_limits.geojson')
      .map(resp => resp.json());
  }

}
