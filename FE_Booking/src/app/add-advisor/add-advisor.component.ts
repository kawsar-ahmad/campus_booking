import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from 'uuid';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
const myId = uuid.v4();
const BaseUrl = environment.apiUrl

@Component({
  selector: 'app-add-advisor',
  templateUrl: './add-advisor.component.html',
  styleUrls: ['./add-advisor.component.scss']
})
export class AddAdvisorComponent implements OnInit {
  typeList=['Professor','Associate Professor','Assistant professor','Lecturer']
  advisorForm = new FormGroup({
    name:new FormControl('',[Validators.required]),
    designation:new FormControl('',[Validators.required]),
  })
  constructor(private http:HttpClient,private _snackBar: MatSnackBar,
    private activatedRouter:ActivatedRoute,private router:Router){}

  ngOnInit(): void {
  }
  submitAdvisor(){
    let formData = this.advisorForm.getRawValue()
    this.http.post(BaseUrl+'/create/advisor',formData).subscribe(res=>{
      console.log("res",res);
      this.openSnackBar("Option Created",'')     
    })
    this.advisorForm.reset();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
