import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class GeocodeService {

  // TODO: need to edit urlgeocoder to work
  private urlgeocoder = 'http://maps.raleighnc.gov/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=1413%20Scales%20st&City=null&State=null&ZIP=null';
  private url = 'https://maps.raleighnc.gov/arcgis/rest/services/Addresses/MapServer/0/query?returnGeometry=true&outSR=4326&geometryPrecision=5&f=json&orderByFields=ADDRESS&where=ADDRESSU like \'';
  private urlTrashDay = 'https://maps.raleighnc.gov/arcgis/rest/services/Services/PortalServices/MapServer/12/query?where=1=1&text=&objectIds=&time=&geometry={"x":-78.64423,"y":35.79834}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=html';

  constructor(private http: Http) { }

  getGeometry(address): Observable<string> {
    return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
  // getGeometry(address): Observable<string>  {
  //   return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res:Response) => res.json())
  //   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  // }

  getTrashDay(coords): Observable<string> {
    return this.http.get(encodeURI(this.url) + encodeURIComponent(address.toUpperCase()) + '%\'').map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}
