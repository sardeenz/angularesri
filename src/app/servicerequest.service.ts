import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class ServicerequestService {

    //private srUrl = 'http://scfp.raleighnc.gov/cityworks/Services/AMS/Authentication/Authenticate';
    //private fuseUrl = 'http://rhsoaprdapp1.ci.raleigh.nc.us:8183/RaleighAPI/cityworks/createServiceRequest';
    private srUrl = 'http://rhsoatstapp1.ci.raleigh.nc.us:8182/RaleighAPI/cityworks/createServiceRequest/';

    public testAuth = JSON.parse('{"LoginName":"pwadmin","Password":"pw2dmin"}');
    //public testSr = JSON.parse('{"callerFirstName": "Surender","callerLastName": "Dalal", "callerWorkPhone": "9196708062", "callerEmail": "surender.dalal@raleighnc.gov ", "problemSid": "263574", "x": "", "y": "", "details": "this is a test", "submitTo": "263755", "callerAddress":"726 davenbury way", "callerCity":"cary" , "callerState":"NC" , "callerZip":"27513", "callerComments":"this is a comment", "comments":"chad is testing" }');
    public testSr = {"callerFirstName": "Surender","callerLastName": "Dalal", "callerWorkPhone": "9196708062", "callerEmail": "surender.dalal@raleighnc.gov ", "problemSid": "263574", "x": "", "y": "", "details": "this is a test", "submitTo": "263755", "callerAddress":"726 davenbury way", "callerCity":"cary" , "callerState":"NC" , "callerZip":"27513", "callerComments":"this is a comment", "comments":"chad is testing" };
    
    public formTest =  {"callerfirstname":"charles","callerlastname":"Foley","address":"1413 Scales St","callerWorkPhone":"9193893777","callerEmail":"sardeenz@gmail.com","requestType":["garbage","recycling"],"callerComments":"test"}

    constructor(private http: Http) { }

  createServiceRequest(form): Observable<string> {

        console.log('form = ', JSON.stringify(form));
        // for authentication to Cityworks use urlencoded 
        //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); // ... Set content type to JSON
        //for Cityworks API we need data= prefix
        //return this.http.post(this.srUrl, 'data= ' + jsonStr, options).map((res: Response) => res.json());

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this.http.post(this.srUrl, this.testSr, options).map((res: Response) => res.json());

  }

}


