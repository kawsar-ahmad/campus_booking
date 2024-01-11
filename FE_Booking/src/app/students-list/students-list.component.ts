import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  typeList=['Roll','CGPA']
  displayedColumns: string[] = ['Name', 'Roll', 'Series', 'CGPA'];
  requests = new MatTableDataSource<any>();
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getStudents()
  }
  change(event:any) {
    console.log(event.value)
    if(event.value =='Roll') {
      debugger
      let students:any = this.requests
      students.sort((a:any,b:any) => a.roll - b.roll)
      this.requests = students
    }else {
      debugger
      let students:any = this.requests
      students.sort((a:any,b:any) => b.cgpa - a.cgpa)
      this.requests = students
    }

  }

  dynamicSort(property:string) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a:any,b:any) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
  getStudents() {
    this.http.get<any>('http://localhost:80/students').subscribe(
      (res) => {
        this.requests = res

      },
      (err) => console.log(err)
    );
  }
  deleteAllStudents() {
    this.http.delete<any>('http://localhost:80/delete/students').subscribe(
      (res) => {
       this.getStudents()
      },
      (err) => console.log(err)
    );
  }

}
