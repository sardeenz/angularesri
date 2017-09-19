import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { User } from './user';



@Injectable()
export class ServicerequestService {
  options: RequestOptions;

  public user: User;
  results: string[];

  // private srUrl = 'http://scfp.raleighnc.gov/cityworks/Services/AMS/Authentication/Authenticate';
  // private fuseUrl = 'http://rhsoaprdapp1.ci.raleigh.nc.us:8183/RaleighAPI/cityworks/createServiceRequest';

  //private createSRUrl = 'http://rhsoatstapp1.ci.raleigh.nc.us:8182/RaleighAPI/cityworks/createServiceRequest/';
  private createSRUrl = 'https://apps.raleighnc.gov/createServiceRequest/';

  private getSRUrl = 'http://rhsoatstapp1.ci.raleigh.nc.us:8182/RaleighAPI/cityworks/getServiceRequest/';
  //private getSRUrl = 'https://apps.raleighnc.gov/getServiceRequest/';
  

  private createSrGatewayUrl = 'http://localhost:8080/createServiceRequest';


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
    const user_request = JSON.stringify(user);
    // const headers = new Headers({ 'Content-Type': 'application/json' });
    // const headers1 = new Headers({'Authorization': 'apiKey 2s65C3hgY9H4Po3Ufj62zI:5xVgdF6KYHnV2bHkkGnl8N'});
    //const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    
    const options = new RequestOptions(); // Create a request option
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
    options.headers.append('Authorization', 'apiKey 2s65C3hgY9H4Po3Ufj62zI:5xVgdF6KYHnV2bHkkGnl8N');
    

    // this works only with httpclient
    // return this.http.post(this.createSRUrl, user_request, 
    //   { headers: new HttpHeaders().set('Authorization', 'apiKey 2s65C3hgY9H4Po3Ufj62zI:5xVgdF6KYHnV2bHkkGnl8N')
    // .set('Content-Type', 'application/json') }).map((res: Response) => res.json());

    return this.http.post(this.createSRUrl, user_request, options).map((res: Response) => res.json());
  }

  // testGateway() {
  //   return this.http.get('http://localhost:8080/ip').map((res: Response) => res.json());
  // }

  getServiceRequest(requestid: string) {
    console.log('getSR url = ', this.getSRUrl + 'requestid');
     //const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    //  const headers = new Headers({ 'Content-Type': 'application/json' });
    //  const options = new RequestOptions({ headers: headers }); // Create a request option

    this.options = new RequestOptions({
      // headers: new Headers({
      //   'Content-Type': 'application/json',
      //   'Authorization': 'apiKey 2s65C3hgY9H4Po3Ufj62zI:5xVgdF6KYHnV2bHkkGnl8N'
      //   // And more
      // })
    });

    // const options = new RequestOptions(); // Create a request option
    // options.headers = new Headers();
    // options.headers.append('Content-Type', 'application/json');
    // options.headers.append('Authorization', 'apiKey 2s65C3hgY9H4Po3Ufj62zI:5xVgdF6KYHnV2bHkkGnl8N');
    
    // return this.http.post(this.srUrl, this.testSr, options).map((res: Response) => res.json());
    //return this.http.get(this.getSRUrl + requestid, options).map((res: Response) => res.json());
    return this.http.get(this.getSRUrl + requestid, this.options).map((res: Response) => res.json());
  }

}


