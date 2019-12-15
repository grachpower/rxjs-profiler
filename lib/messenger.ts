import {MessageTypes} from "./constants";
import {MessageModel} from "./models/message.model";
import {report} from "./reporter";

export function sendMessage(message: MessageModel): void {
    switch (message.type) {
        case MessageTypes.SUBSCRIBE:
            logSubscribe(message);
            break;
        case MessageTypes.UNSUBSCRIBE:
            logUnsubscribe(message);
            break;
        case MessageTypes.RELOAD:
            logReload(message);
            break;
    }
}

function logSubscribe(message: MessageModel): void {
    report(message);
}

function logUnsubscribe(message: MessageModel): void {
    report(message);
}

function logReload(message: MessageModel): void {
    report(message);
}
