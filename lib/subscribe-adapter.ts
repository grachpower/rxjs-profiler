import { config, Observable, PartialObserver, Subscription } from "rxjs";
import { stacktrace } from "./trace";

import { generateId } from "./id-gen";
import { NOOP_ID } from "./constants";
import { toSubscriber } from "rxjs/internal-compatibility";

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
        console.log('|-----------------------|');
        console.log(this);
        const date = new Date();
        console.log(`Subscribed: name - ${debugName},  date - ${date}`);
        console.log('|-----------------------|');
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



/**
 * @deprecated
 */
function getDebugName(source: Observable<any>): string {
    if ((source as any)._debugName) {
        return (source as any)._debugName;
    }

    if (source.source) {
        return getDebugName(source.source);
    }

    return `__gen:${generateId()}`;
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