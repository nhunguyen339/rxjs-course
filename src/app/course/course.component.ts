import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';

import { fetchCoursesHttp } from '../common/util';
@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {


    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: any;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = fetchCoursesHttp(`/api/courses/${this.courseId}`)
                            .pipe(map((res: Course) => res))
    }

    ngAfterViewInit() {

        const searchLessons$ = fromEvent(this.input.nativeElement, 'input')
                                .pipe(
                                    map((event: any) => event.target.value),
                                    debounceTime(400),
                                    distinctUntilChanged(),
                                    switchMap(val => this.searchLessons(val))
                                );
        const initialLessons$ = this.searchLessons();

        this.lessons$ = concat(initialLessons$, searchLessons$);
    }

    searchLessons(search = ''): Observable<Lesson[]> {
        return fetchCoursesHttp(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
            map(res => res['payload'])
        )
    }




}
