import { BehaviorSubject, from, Observable } from "rxjs";
import { map, retryWhen, delayWhen, finalize, filter, tap } from 'rxjs/operators';
import { timer } from 'rxjs';

import { Course } from "../model/course";
import { fetchCoursesHttp } from './util';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    subject = new BehaviorSubject<Course[]>([]);
    courses$ = this.subject.asObservable();

    init() {
        console.log('init')
        const http$ = fetchCoursesHttp("/api/courses");
        http$.pipe(
            map((res) => Object.values(res["payload"])),
            retryWhen(error => error.pipe(
                delayWhen(() => timer(3000))
            )),
            finalize(() => console.log('debug')),
        ).subscribe((courses: Course[]) => {
            return this.subject.next(courses)
        });
    }

    selectBeginnerCourses() {
        return this.selectByCategory('BEGINNER');
    }

    selectAdvancedCourses() {
        return this.selectByCategory('ADVANCED');
    }

    selectByCategory(type: string) {
        return this.courses$
            .pipe(map((courses: Course[]) => courses.filter(course => course.category === type)));
    }

    selectById(courseId: number): Observable<Course> {
        return this.courses$
            .pipe(
                map((courses: Course[]) => courses.find(course => course.id == courseId)),
                filter(course => !!course),
            );
    }

    save(courseId: number, changes: any) {
        const courses = this.subject.getValue();

        const courseIndex = courses.findIndex(course => course.id === courseId);

        const newCourses = [...courses];

        newCourses[courseIndex] = {
            ...newCourses[courseIndex],
            ...changes
        };

        this.subject.next(newCourses);

        return from(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }))
    }
}