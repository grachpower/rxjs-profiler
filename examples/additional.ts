import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from "rxjs/internal/operators";

export const testSubjectSubscription = () => {
    const stream$ = new Subject();

    stream$
        .pipe(
            tap(value => console.log(value)),
            map(data => data),
        )
        .subscribe();

    stream$.next('lol');
    stream$.next('kek');
    stream$.next('cheburek');

    stream$.unsubscribe();
};