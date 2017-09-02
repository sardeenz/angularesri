import { Candidate, Geocode } from './geocode';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FilteraddressService {

  // tslint:disable-next-line:max-line-length
  
  // need to adjust parsing on urlGeocoder2 and 3 since it has a different format
  private urlGeocoder2 = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/Locator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=';
  private urlGeocoder3 = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/RPD_Locator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=';
  
  private urlGeocoder1 = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/Composite/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Address=';
  private urlGeocoder = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=';

  constructor(private http: HttpClient) { }

  getGeometry(address): Observable<Candidate[]> {
    // return this.http.get<Geocode>(encodeURI(this.urlgeocoder) + encodeURIComponent(address) + ('&City=raleigh'))
    // .map((Geocode: Geocode) => Geocode);

    // TODO: only return 
        return this.http.get(encodeURI(this.urlGeocoder) + encodeURIComponent(address) + ('&City=raleigh'))
    .map((Geocode: Geocode) => Geocode.candidates);

    // console.log('geoAddress = ', encodeURI(this.urlgeocoder) + encodeURIComponent(address));
    // return this.http.get(encodeURI(this.urlgeocoder) + encodeURIComponent(address) + ('&City=raleigh')).map((res: Response) => res.json())
    //   .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
