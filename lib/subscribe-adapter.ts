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

        if (this.source && this.source._debugName) {
            debugName = this.source._debugName;
        } else if (this._debugName) {
            debugName = this._debugName;
        }

        if (!debugName) {
            if (this.source) {
                this.source._debugName = `__gen:${generateId()}`;
            } else {
                this._debugName = `__gen:${generateId()}`;
            }
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