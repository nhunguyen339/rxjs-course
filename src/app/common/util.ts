import { Observable } from 'rxjs';
import { Course } from '../model/course';

export const fetchCoursesHttp = (url) => new Observable(observer => {
  fetch(url)
    .then(res => res.json())
    .then(body => {
      observer.next(body);
      observer.complete();
    })
    .catch(error => {
      observer.error();
    })
});
