import { initRxjsProfiler } from '../lib';

import { testSubjectSubscription } from "./additional";


initRxjsProfiler();

testSubjectSubscription();

setTimeout(() => {
    postMessage(
        {
            message: 'KEK',
            source: "rxjs-profiler"
        },
        "*"
    );
}, 1000);