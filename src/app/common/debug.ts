import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFOR,
  ERROR
}

let rxJsLoggingLevel = RxJsLoggingLevel.INFOR;

export const setRxJsLoggingLevel = (level) => {
  rxJsLoggingLevel = level;
};

export const debug = (loggingLevel, message) =>
  (source: Observable<any>) => source.pipe(
    tap(value => {
      if (loggingLevel >= rxJsLoggingLevel) {
        console.log(message + ' : ',  value)
      }
    })
);
