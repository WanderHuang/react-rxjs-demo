import { of } from 'rxjs';
import { mergeMap, retryWhen, tap, scan, catchError } from 'rxjs/operators';
import { ajax, isType } from '../utils/helper';

export const retryAjax = (url, payload, times = 3) => {
  return (whenTap, whenError) => {
    return of(url).pipe(
      mergeMap(url => ajax(url, payload)),
      retryWhen(err => 
        err.pipe(
          tap(val => {
            if (isType(whenTap, 'Function')) {
              whenTap(val.message);
            }
          }),
          scan((acc, val) => {
            if (acc > times) {
              throw new Error(`${val}, retry ${times} times, still error.`);
            } else {
              return acc + 1;
            }
          }, 1),
          catchError(err => {
            if (isType(whenError, 'Function')) {
              whenError(err.message, err);
            }
            return of(err);
          })
        )
      )
    )
  }
}