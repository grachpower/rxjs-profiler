import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import '../lib/index';

const stream$ = new Subject();

stream$
    .pipe(
        tap(value => console.log(value)),
    )
    .subscribe();

stream$.next('lol');
stream$.next('kek');
stream$.next('cheburek');

stream$.unsubscribe();