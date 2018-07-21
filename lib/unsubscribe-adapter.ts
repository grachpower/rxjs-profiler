import { Subject, Subscription } from "rxjs";

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
        console.log(`Observable unsubscribed: ${date}`);

        return originalUnsubscribe.bind(this)(args);
    };
}

function patchedSubjectUbsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        console.log(`Subject unsubscribed: ${date}`);

        return originalUnsubscribe.bind(this)(args);
    };
}