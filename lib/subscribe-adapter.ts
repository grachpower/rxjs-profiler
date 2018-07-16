import { Observable } from "rxjs";

export function patchSubscribe(): any {
    const originalSubscribe = Observable.prototype.subscribe;

    Observable.prototype.subscribe = pathedSubscribe(originalSubscribe);
}

function pathedSubscribe(originalSub: Function): any {
    return function(args?) {
        const date = new Date();
        console.log(`subscribed, date: ${date}`);

        return originalSub.bind(this)(args);
    };
}