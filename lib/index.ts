import { Observable } from "rxjs";;

// console.log(originalSubscribe.toString());
function init(): void {
    patchSubscribe();
    patchUnsubscribe();
}

function patchSubscribe(): void {
    const originalSubscribe = Observable.prototype.subscribe;

    Observable.prototype.subscribe = subscribeAdapter;

    function subscribeAdapter(args?) {
        console.log('subscribed');

        return originalSubscribe.apply(Observable, args);
    }
}

function patchUnsubscribe(): void {


}

init();