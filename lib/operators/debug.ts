import { Observable } from "rxjs/index";

export function debug<T>(name: string) {
    return function debugOperatorFunction(source: Observable<T>): Observable<T> {
        (<any>source)._debugName = name;

        return source;
    };
}
