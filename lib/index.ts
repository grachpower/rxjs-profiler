import { patchSubscribe } from "./subscribe-adapter";
import { patchUnsubscribe } from "./unsubscribe-adapter";

export function initRxjsProfiler(): void {
    patchSubscribe();
    patchUnsubscribe();
}
