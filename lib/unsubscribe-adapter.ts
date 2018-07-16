import { Subscription } from "rxjs";

export function patchUnsubscribe(): any {
    const originalUnsubscribe = Subscription.prototype.unsubscribe;

    Subscription.prototype.unsubscribe = patchedUnsubscribe(originalUnsubscribe);
}


function patchedUnsubscribe(originalUnsubscribe: Function): any {
    return function(args?) {
        const date = new Date();
        console.log(`unsubscribed: ${date}`);

        return originalUnsubscribe.bind(this)(args);
    };
}