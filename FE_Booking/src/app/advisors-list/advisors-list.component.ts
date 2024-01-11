import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-advisors-list',
  templateUrl: './advisors-list.component.html',
  styleUrls: ['./advisors-list.component.scss']
})
export class AdvisorsListComponent implements OnInit {

  displayedColumns: string[] = ['Name','Designation'];
  requests = new MatTableDataSource<any>();
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getAdvisors()
  }
  getAdvisors() {
    this.http.get<any>('http://localhost:80/advisors').subscribe(
      (res) => {
        this.requests = res
      },
      (err) => console.log(err)
    );
  }
  deleteAllStudents() {
    this.http.delete<any>('http://localhost:80/delete/advisors').subscribe(
      (res) => {
       this.getAdvisors()
      },
      (err) => console.log(err)
    );
  }

}
