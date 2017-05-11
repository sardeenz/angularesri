import { Component, OnInit, Optional } from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})
export class DialogContentComponent implements OnInit {

  title = 'DialogContentComponent works!';

  constructor(@Optional() public dialogRef: MdDialogRef<DialogContentComponent>) { 
    }

  ngOnInit() {
  }

}
