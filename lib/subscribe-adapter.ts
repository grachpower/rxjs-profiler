import { Observable } from "rxjs";
import { stacktrace } from "./trace";
import { generateId } from "./id-gen";

export function patchSubscribe(): any {
    const originalSubscribe = Observable.prototype.subscribe;

    Observable.prototype.subscribe = patchedSubscribe(originalSubscribe);
}

function patchedSubscribe(originalSub: Function): any {
    return function(args?) {
        const date = new Date();
        // console.log(stacktrace());

        if (this.source && !this.source._debugName) {
            console.log(this);
            console.log('generated');
            this.source._debugName = `__gen:${generateId()}`;
        }

        console.log(`Subscribed: name - ${this._debugName},  date - ${date}`);

        const result = originalSub.bind(this)(args);
        // result.source._debugName = generateId();
        return result;
    };
}