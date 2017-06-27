import { ServicerequestService } from './servicerequest.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

// for angular material
import {MdButtonModule, MdCheckboxModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@angular/material';
import { EsriMapComponent } from './esri-map/esri-map.component';

// for ESRI GIS stuff
import { EsriLoaderService } from 'angular2-esri-loader';
import { GeocodeService } from 'app/geocode.service';
import { DialogContentComponent } from './dialog-content/dialog-content.component';

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent,
    DialogContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdCheckboxModule,
    MaterialModule,
  ],
  entryComponents: [DialogContentComponent],
  providers: [EsriLoaderService, GeocodeService, ServicerequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
