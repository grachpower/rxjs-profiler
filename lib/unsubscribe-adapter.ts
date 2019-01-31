import { Subject, Subscription, Subscriber } from "rxjs";
import { stacktrace } from "./trace";

export function patchUnsubscribe() {
    patchObservableUnsubscribe();
    patchSubscriberUnsubscribe();
    patchSubjectUnsubscribe();
}

function patchObservableUnsubscribe(): any {
    const originalUnsubscribe = Subscription.prototype.unsubscribe;

    Subscription.prototype.unsubscribe = patchedObservableUnsubscribe(originalUnsubscribe);
}

function patchSubscriberUnsubscribe(): any {
    const originalUnsubscribe = Subscriber.prototype.unsubscribe;

    Subscriber.prototype.unsubscribe = patchedSubscriberUnsubscribe(originalUnsubscribe);
}

function patchSubjectUnsubscribe(): any {
    const originalUnsubscribe = Subscriber.prototype.unsubscribe;

    Subject.prototype.unsubscribe = patchedSubjectUnsubscribe(originalUnsubscribe);
}


function patchedObservableUnsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        // console.log(this);
        console.log(`Observable unsubscribed: name - ${this._debugName}, date - ${date}`);
        // console.log(stacktrace());

        return originalUnsubscribe.bind(this)(args);
    };
}

function patchedSubscriberUnsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        console.log(this);
        console.log(`Subscriber unsubscribed: name - ${this._debugName}, date - ${date}`);
        // console.log(stacktrace());

        return originalUnsubscribe.bind(this)(args);
    };
}

function patchedSubjectUnsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        console.log(this);
        console.log(`Subject unsubscribed: name - ${this._debugName}, date - ${date}`);
        // console.log(stacktrace());

        return originalUnsubscribe.bind(this)(args);
    };
}
