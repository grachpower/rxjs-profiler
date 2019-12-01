import { MessageTypes } from "./constants";
import { MessageModel } from "./models/message.model";

export function sendMessage(message: MessageModel): void {
    switch (message.type) {
        case MessageTypes.SUBSCRIBE:
            logSubscribe(message);
            break;
        case MessageTypes.UNSUBSCRIBE:
            logUnsubscribe(message);
            break;
    }
}

function logSubscribe(message: MessageModel): void {
    console.log('|-----------------------|');
    console.log(`Observable subscribed: name - ${message.name},  date - ${message.date}`);
    console.log('|-----------------------|');
}

function logUnsubscribe(message: MessageModel): void {
    console.log('|-----------------------|');
    console.log(`Observable unsubscribed: name - ${message.name}, date - ${message.date}`);
    console.log('|-----------------------|');
}
