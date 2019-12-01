import { patchSubscribe } from "./subscribe-adapter";

export function initRxjsProfiler(): void {
    patchSubscribe();
}
