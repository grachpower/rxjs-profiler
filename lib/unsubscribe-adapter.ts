import { Subject, Subscription, Subscriber, TeardownLogic } from "rxjs";
import { InnerSubscriber } from "rxjs/internal-compatibility";

import { stacktrace } from "./trace";

export function patchUnsubscribe() {
    patchSubscriptionUnsubscribe();
    patchSubscriptionAdd();
    patchSubjectUnsubscribe();
}

function patchSubscriptionUnsubscribe(): any {
    const originalUnsubscribe = Subscription.prototype.unsubscribe;

    Subscription.prototype.unsubscribe = patchedSubscriptionUnsubscribe(originalUnsubscribe);
}

function patchSubscriptionAdd(): any {
    Subscription.prototype.add = patchedSubscriptionAdd;
}

function patchSubjectUnsubscribe(): any {
    const originalUnsubscribe = Subscriber.prototype.unsubscribe;

    Subject.prototype.unsubscribe = patchedSubjectUnsubscribe(originalUnsubscribe);
}


function patchedSubscriptionUnsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        let debugName;

        debugName = findDebugName.bind(this)();

        const date = new Date();
        console.log('|-----------------------|');
        console.log(this);
        console.log(`Observable unsubscribed: name - ${debugName}, date - ${date}`);
        // console.log(stacktrace());
        console.log('|-----------------------|');

        return originalUnsubscribe.bind(this)(args);
    };
}

function patchedSubjectUnsubscribe(originalUnsubscribe: Function): any {
    return function (args?) {
        const date = new Date();
        console.log('|-----------------------|');
        console.log(this);
        console.log(`Subject unsubscribed: name - ${this._debugName}, date - ${date}`);
        // console.log(stacktrace());
        console.log('|-----------------------|');

        return originalUnsubscribe.bind(this)(args);
    };
}

function patchedSubscriptionAdd(teardown: TeardownLogic): Subscription {
    let subscription = (<Subscription>teardown);
    switch (typeof teardown) {
        case 'function':
            subscription = new Subscription(<(() => void)>teardown);
        case 'object':
            if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                // This also covers the case where `subscription` is `Subscription.EMPTY`, which is always in `closed` state.
                return subscription;
            } else if (this.closed) {
                subscription.unsubscribe();
                return subscription;
            } else if (!(subscription instanceof Subscription)) {
                const tmp = subscription;
                subscription = new Subscription();
                (subscription as any)._subscriptions = [tmp];
            }
            break;
        default: {
            if (!(<any>teardown)) {
                return Subscription.EMPTY;
            }
            throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
    }

    if ((subscription as any)._addParent(this)) {
        // Optimize for the common case when adding the first subscription.
        const subscriptions = this._subscriptions;
        if (subscriptions) {
            subscriptions.push(subscription);
        } else {
            this._subscriptions = [subscription];
        }
    }

    return subscription;
}

function findDebugName(): string {
    if (this._debugName) {
        return this._debugName;
    }

    if (this.parent) {
        return findDebugName.bind(this.parent)();
    }

    return null;
}