import { initRxjsProfiler } from '../lib';

import {intervalStream, testObservableSubscription, testSubjectSubscription} from "./additional";


initRxjsProfiler();

testSubjectSubscription();
testObservableSubscription();
intervalStream();

