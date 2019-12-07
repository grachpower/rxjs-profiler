import { MessageTypes } from "../constants";

export interface MessageDto {
    type: MessageTypes;
    trace?: string;
    date?: number;
    name?: string;
    depthIndex?: number;
}

export class MessageModel {
    public type: MessageTypes;
    public trace: string;
    public date: number;
    public name: string;
    public depthIndex: number;

    constructor(message: MessageDto) {
        this.type = message.type;
        this.trace = message.trace;
        this.date = message.date;
        this.name = message.name;
        this.depthIndex = message.depthIndex;
    }
}
