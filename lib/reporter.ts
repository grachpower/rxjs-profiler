import { MessageModel } from "./models/message.model";

export function report(message: MessageModel): void {
    postMessage(
        {
            message: message,
            source: "rxjs-profiler"
        },
        "*"
    );
}
