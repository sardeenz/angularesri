import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  declarations: [
    AppComponent,
    EsriMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdCheckboxModule,
    MaterialModule.forRoot(),
  ],
  providers: [EsriLoaderService, GeocodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
