import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/assets/api.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-my-to-do',
  templateUrl: './my-to-do.component.html',
  styleUrls: ['./my-to-do.component.scss']
})


export class MyToDoComponent implements OnInit {
  TotalTask = ''
  completedTask = ''
  pendingTask = ''
  canceledTask = ''
  deletedTask = ''
  user = ""
  sort = "pending"



  allTask: any = []

  taskForm = this.formbuld.group({
    title: ['', [Validators.required]],
    task: ['', [Validators.required]]

  })

  constructor(private formbuld: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {

    this.api.getallTask().subscribe((result: any) => {
      console.log(this.allTask)
      this.allTask = result.data
      this.completedTask = result.taskCount.completedTask
      this.pendingTask = result.taskCount.pendingTask
      this.canceledTask = result.taskCount.canceledTask
      this.deletedTask = result.taskCount.deletedTask
      this.TotalTask = result.taskCount.totalTask
      this.user = (localStorage.getItem("username")) || ""

    })
  }
  // adding new task
  added() {
    if (this.taskForm.valid) {
      let taskId = uuid()
      let title = this.taskForm.value.title
      let task = this.taskForm.value.task
      this.api.addnewTask(taskId, title, task).subscribe((result: any) => {
        alert(result.message)
        window.location.reload()
      },
        (result: any) => {
          alert(result.error.message)
        })
    } else {
      alert('Fill task box')
    }
  }
  //refresh form
  clear() {
    this.taskForm.reset()
  }

  // task complete
  TaskComplete(objId: Number) {
    // console.log(num)
    let status = "completed"
    this.api.taskStatus(objId, status).subscribe((result: any) => {
      alert(result.message)
      window.location.reload()
    },
      (result: any) => {
        alert(result.error.message)
        window.location.reload()
      }
    )
  }
  // task cancel
  taskCancel(objId: Number) {
    let status = "canceled"
    this.api.taskStatus(objId, status).subscribe((result: any) => {
      alert(result.message)
      window.location.reload()
    },
      (result: any) => {
        alert(result.error.message)
        window.location.reload()
      })
  }
  // delete task
  deleteTask(id: any) {
    console.log(id)
    this.api.taskDelete(id).subscribe((result: any) => {
      alert(result.message)
      window.location.reload()
    },
      (result: any) => {
        alert(result.error.message)
        window.location.reload()
      }
    )
  }
  //filter in status
  sortTask(status: any) {
    //console.log(status)
    this.sort = status
  }



  logout() {
    localStorage.clear()
    this.router.navigateByUrl('')

  }

}

