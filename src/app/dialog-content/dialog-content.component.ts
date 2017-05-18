import { Component, OnInit, Optional, Input } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent implements OnInit {

  title = 'DialogContentComponent works!';
  @Input() page: string;

  constructor(@Optional() public dialogRef: MdDialogRef<DialogContentComponent>) { 
    console.log('test in constructor = ', this.page);
  }

  public callFunction(){
    console.log('test in callFunction = ', this.page);

  }

  ngOnInit() {
    console.log('test in ngOnInit = ', this.page);
  }

}
