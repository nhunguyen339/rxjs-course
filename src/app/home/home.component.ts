import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer, noop } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  filter,
} from "rxjs/operators";


import { fetchCoursesHttp } from "../common/util";
@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  ngOnInit() {
    const http$ = fetchCoursesHttp("/api/courses");
    const courses$ = http$.pipe(
      map((res) => Object.values(res["payload"])),
      shareReplay()
    );

    this.beginnerCourses$ = courses$.pipe(
      map((courses: Course[]) => {
        console.log(courses)

        return courses.filter((course: Course) => course.category === 'BEGINNER')
      })
    )

    this.advancedCourses$ = courses$.pipe(
      map((courses: Course[]) => {
        console.log(courses)

        return courses.filter((course: Course) => course.category === 'ADVANCED')
      })
    )
  }
}
