import { Subject, Subscription } from "rxjs";
import { stacktrace } from "./trace";

export function patchUnsubscribe() {
    patchObservableUnsubscribe();
    patchSubjectUnsubscribe()
}

function patchObservableUnsubscribe(): any {
    const originalUnsubscribe = Subscription.prototype.unsubscribe;

    Subscription.prototype.unsubscribe = patchedObservableUnsubscribe(originalUnsubscribe);
}

function patchSubjectUnsubscribe(): any {
    const originalUnsubscribe = Subject.prototype.unsubscribe;

    Subject.prototype.unsubscribe = patchedSubjectUbsubscribe(originalUnsubscribe);
}


function patchedObservableUnsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        console.log(`Observable unsubscribed: name - ${this._debugName}, date - ${date}`);
        // console.log(stacktrace());

        return originalUnsubscribe.bind(this)(args);
    };
}

function patchedSubjectUbsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        console.log(`Observable unsubscribed: name - ${this._debugName}, date - ${date}`);
        // console.log(stacktrace());

        return originalUnsubscribe.bind(this)(args);
    };
}