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
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  dateForm=new FormGroup({
    name:new FormControl('',[Validators.required]),
    roll:new FormControl('',[Validators.required]),
    cgpa:new FormControl('',[Validators.required]),
    series:new FormControl(),
  })
  constructor(private http:HttpClient,private _snackBar: MatSnackBar,
    private activatedRouter:ActivatedRoute,private router:Router){}

  ngOnInit(): void {
  }

  submitdate(){
    let formData = this.dateForm.getRawValue()
    this.http.post(BaseUrl+'/create/student',formData).subscribe(res=>{
      console.log("res",res);
      this.openSnackBar("Option Created",'')     
    })
    this.dateForm.reset();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
