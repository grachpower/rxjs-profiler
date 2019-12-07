import {sendMessage} from "./messenger";
import {MessageTypes} from "./constants";
import {MessageModel} from "./models/message.model";

export function watchPageReload() {
    window.addEventListener("beforeunload", function(event) {
        sendMessage({
            type: MessageTypes.RELOAD,
        } as MessageModel);
    });
}
