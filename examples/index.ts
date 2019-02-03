import { initRxjsProfiler } from '../lib';

import { testObservableSubscription, testSubjectSubscription } from "./additional";


initRxjsProfiler();

// testSubjectSubscription();
testObservableSubscription();

setTimeout(() => {
    postMessage(
        {
            message: 'KEK',
            source: "rxjs-profiler"
        },
        "*"
    );
}, 1000);