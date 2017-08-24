import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { User } from './user';



@Injectable()
export class ServicerequestService {

  public user: User;

  // private srUrl = 'http://scfp.raleighnc.gov/cityworks/Services/AMS/Authentication/Authenticate';
  // private fuseUrl = 'http://rhsoaprdapp1.ci.raleigh.nc.us:8183/RaleighAPI/cityworks/createServiceRequest';

  private createSRUrl = 'http://rhsoatstapp1.ci.raleigh.nc.us:8182/RaleighAPI/cityworks/createServiceRequest/';
  private getSRUrl = 'http://rhsoatstapp1.ci.raleigh.nc.us:8182/RaleighAPI/cityworks/getServiceRequest/';


  public testAuth = JSON.parse('{"LoginName":"pwadmin","Password":"pw2dmin"}');
  public testSr = {
    'callerFirstName': 'Surender', 'callerLastName': 'Dalal', 'callerWorkPhone': '9196708062',
    'callerEmail': 'surender.dalal@raleighnc.gov ', 'problemSid': '263574', 'x': '', 'y': '', 'details': 'this is a test',
    'submitTo': '263755', 'callerAddress': '726 davenbury way', 'callerCity': 'cary', 'callerState': 'NC',
    'callerZip': '27513', 'callerComments': 'this is a comment', 'comments': 'chad is testing'
  };

  public formTest = {
    'callerfirstname': 'charles', 'callerlastname': 'Foley', 'address': '1413 Scales St',
    'callerWorkPhone': '9193893777', 'callerEmail': 'sardeenz@gmail.com', 'problemsid': ['garbage', 'recycling'], 'callerComments': 'test'
  };

  public dalal = { "callerFirstName": "charles", "callerLastName": "Foley", "address": "1413 Scales Street", "callerWorkPhone": "9193893777", "callerEmail": "sardeenz@gmail.com", "problemSid": "263551", "callerComments": "web", "comments": "created by SWS online customer web form", "x": "-78.64423", "y": "35.79834", "details": "" };

  constructor(private http: Http) { }

  createServiceRequest(user): Observable<string> {

    // for authentication to Cityworks use urlencoded
    // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }); // ... Set content type to JSON
    // for Cityworks API we need data= prefix
    // return this.http.post(this.srUrl, 'data= ' + jsonStr, options).map((res: Response) => res.json());

    console.log('form = ', JSON.stringify(user));
    let user_request = JSON.stringify(user);

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers }); // Create a request option
    // return this.http.post(this.srUrl, this.testSr, options).map((res: Response) => res.json());
    return this.http.post(this.createSRUrl, user_request, options).map((res: Response) => res.json());

  }

  getServiceRequest(requestid: string) {
    console.log('getSR url = ', this.getSRUrl + 'requestid');
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers }); // Create a request option
    // return this.http.post(this.srUrl, this.testSr, options).map((res: Response) => res.json());
    return this.http.get(this.getSRUrl + requestid, options).map((res: Response) => res.json());
  }

}


