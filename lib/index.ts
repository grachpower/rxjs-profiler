import { patchSubscribe } from "./subscribe-adapter";
import { watchPageReload } from "./page-reload-watcher";

export interface RxJSProfilerOptions {
    isProdMode?: boolean;
}

export function initRxjsProfiler(options: RxJSProfilerOptions = {}): void {
    if (options && !options.isProdMode) {
        patchSubscribe();
        watchPageReload();
    }
}
