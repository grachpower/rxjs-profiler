import { Observable } from "rxjs";
import { stacktrace } from "./trace";

import { generateId } from "./id-gen";
import { NOOP_ID } from "./constants";

export function patchSubscribe(): any {
    const originalSubscribe = Observable.prototype.subscribe;

    Observable.prototype.subscribe = patchedSubscribe(originalSubscribe);
}

function patchedSubscribe(originalSub: Function): any {
    return function(args?) {
        // console.log(stacktrace());

        let debugName = NOOP_ID;


        if (this._debugName) {
            debugName = this._debugName;
        } else {
            debugName = generateDebugName();
        }

        if (debugName !== NOOP_ID) {
            // Handle subscription
            const date = new Date();
            console.log(`Subscribed: name - ${debugName},  date - ${date}`);
        }

        const result = originalSub.bind(this)(args);
        return result;
    };
}

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