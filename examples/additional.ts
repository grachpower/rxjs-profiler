import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from "rxjs/internal/operators";
import { debug } from "../lib/operators/debug";

export const testSubjectSubscription = () => {
    const stream$ = new Subject();

    stream$
        .pipe(
            debug('testName'),
            tap(value => console.log(value)),
            map(data => data),
        )
        .subscribe();

    stream$.next('lol');
    stream$.next('kek');
    // stream$.next('cheburek');

    stream$.unsubscribe();

    // const stream2$ = new Subject();
    //
    // stream2$
    //     .pipe(
    //         debug('name for test'),
    //         tap(value => console.log(value)),
    //         map(data => data),
    //     )
    //     .subscribe();
    //
    // stream2$.next('lol');
    // stream2$.next('cheburek');
};