import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ServicerequestService {

    private srUrl = 'http://scfp.raleighnc.gov/cityworks/Services/AMS/Authentication/Authenticate';
    //private fuseUrl = 'http://rhsoaprdapp1.ci.raleigh.nc.us:8183/RaleighAPI/cityworks/createServiceRequest';
    
    public x;
    public jdata = JSON.parse('{"LoginName":"pwadmin","Password":"pw2dmin"}');

    constructor(private http: Http) { }

  createServiceRequest(form): Observable<string> {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option
        //let jsonStr = JSON.stringify(form);
        let jsonStr = JSON.stringify(this.jdata);
        return this.http.post(this.srUrl, 'data= ' + jsonStr, options).map((res: Response) => res.json());

  }

}
