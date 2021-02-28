import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer, noop, throwError } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  filter,
  finalize,
} from "rxjs/operators";


import { fetchCoursesHttp } from "../common/util";
import { StoreService } from "../common/store";
// Have minimun 3 ways to handle rxjs error: replace, rethrow, retry
@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private store: StoreService) {}

  ngOnInit() {
    this.beginnerCourses$ = this.store.selectBeginnerCourses();
    this.advancedCourses$ = this.store.selectAdvancedCourses();
  }
}
