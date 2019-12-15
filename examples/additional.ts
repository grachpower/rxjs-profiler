import {from, interval, NEVER, of, Subject} from 'rxjs';
import {mergeMap, switchMap, take, tap} from 'rxjs/operators';
import { map } from "rxjs/internal/operators";
import { debug } from "../lib/operators/debug";

export const testSubjectSubscription = () => {
    const stream$ = new Subject();

    stream$
        .pipe(
            debug('testName 2'),
            tap(value => console.log(value)),
            map(data => data),
            switchMap(() => of('switchMap')),
        )
        .subscribe();

    stream$.next('lol');
    stream$.next('kek');

    stream$.complete();
};

export const testObservableSubscription = () => {
  const stream$ = from ([1, 3]);

  stream$
      .pipe(
          debug('testName'),
          map(data => data),
          debug('mapDebug'),
          switchMap(() => of('switchMap')),
          debug('switchDebug'),
          // switchMap(() => NEVER),
      )
      .subscribe();
};

export const intervalStream = () => {
  const source$ = interval(1000).pipe(
      debug('interval source'),
      take(10),
  );

  source$.subscribe();
};
