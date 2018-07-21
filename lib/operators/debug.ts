import { Observable, Operator, Subscriber, TeardownLogic } from "rxjs/index";

export function debug<T>(name: string) {
    return function debugOperatorFunction(source: Observable<T>): Observable<T> {
        (<any>source)._debugName = name;

        return source;
    };
}

class DebugOperator<T> implements Operator<T, T> {
    constructor(private debugName: string) { }

    call(subscriber: Subscriber<T>, source: any): TeardownLogic {
        return source.subscribe(new DebugSubscriber(subscriber, this.debugName));
    }
}

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DebugSubscriber<T> extends Subscriber<T> {

    constructor(destination: Subscriber<T>,
                private debugName: string) {
        super(destination);
    }

    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    // protected _next(value: T) {
    //     let result: any;
    //     try {
    //         result = this.predicate.call(this.thisArg, value, this.count++);
    //     } catch (err) {
    //         this.destination.error(err);
    //         return;
    //     }
    //     if (result) {
    //         this.destination.next(value);
    //     }
    // }
}