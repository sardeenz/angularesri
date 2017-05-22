- This is a sample angular-cli app that uses angular 4 and material and esri map

- install material
`npm install --save @angular/material`
`npm install --save @angular/animations`

- import in app.module.ts
import {MdButtonModule, MdCheckboxModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@angular/material';
```
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdCheckboxModule,
    MaterialModule.forRoot(),
  ],
```

- add to styles.css
`@import "../node_modules/@angular/material/prebuilt-themes/indigo-pink.css";`

- inside index.html (after favicon)
`<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">`

- add the map
https://gist.github.com/tomwayson/e6260adfd56c2529313936528b8adacd

npm install --save @types/arcgis-js-api


# Deployment
ng build --prod --bh /sws/
zip -r dist.zip dist
scp -i ~/code/sysadmin/bc-prod.pem dist.zip ubuntu@54.148.0.119:/tmp

Don't forget to uncomment stuff in polyfills.ts to IE browers


# Servicerequest

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
