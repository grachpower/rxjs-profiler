import {config, Observable, PartialObserver, Subscriber, Subscription} from "rxjs";

import {generateId} from "./id-gen";
import {MessageTypes, NOOP_ID} from "./constants";
import {toSubscriber} from "rxjs/internal-compatibility";
import {MessageModel} from "./models/message.model";
import {sendMessage} from "./messenger";
import {stacktrace} from "./trace";

export function patchSubscribe(): any {
    Observable.prototype.subscribe = newSubscribe;
}

function newSubscribe(observerOrNext?: PartialObserver<any> | ((value: any) => void),
    error?: (error: any) => void,
    complete?: () => void): Subscription {

    let debugName = NOOP_ID;

    if (this._debugName) {
        debugName = this._debugName;
    } else {
        debugName = generateDebugName();
    }

    this._debugName = debugName;
    this._debugNames = getDebugNames(this);
    this._debugIndex = getDebugDepthIndex(this, debugName);

    const { operator } = this;
    const sink = toSubscriber(observerOrNext, error, complete);


    if (sink) {
        (sink as any)._debugName = debugName;
        (sink as any)._debugNames = this._debugNames;
        (sink as any)._debugIndex = this._debugIndex;
    }

    if (debugName !== NOOP_ID) {
        const subscribeMessage = new MessageModel({
            name: debugName,
            date: Date.now(),
            type: MessageTypes.SUBSCRIBE,
            trace: stacktrace(),
            depthIndex: this._debugIndex,
        });

        sendMessage(subscribeMessage);
    }

    if (operator) {
        sink.add(operator.call(sink, this.source));
    } else {
        sink.add(
            this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink)
        );
    }

    sink.add(teardownCondition(sink));

    if (config.useDeprecatedSynchronousErrorHandling) {
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
    }

    return sink;
}

function generateDebugName() {
    return `__gen:${generateId()}`;
}

function getDebugNames(source: Observable<any>, names: string[] = []): string[] {
    let items = [...names];

    if ((source as any)._debugName) {
        const currentDebugName = (source as any)._debugName;

        items = [currentDebugName, ...names]
    }

    if (source.source) {
        return getDebugNames(source.source, items);
    }

    return items;
}

function getDebugDepthIndex(source: Observable<any>, name: string): number {
    if ((source as any)._debugNames) {
        return (source as any)._debugNames.indexOf(name);
    }

    return -1;
}

function teardownCondition(subscriber: Subscriber<any>): () => any {
    return () => {
        const unsubscribeMessage = new MessageModel({
            name: (subscriber as any)._debugName,
            date: Date.now(),
            type: MessageTypes.UNSUBSCRIBE,
            depthIndex: (subscriber as any)._debugIndex,
        });

        sendMessage(unsubscribeMessage);
    };
}
