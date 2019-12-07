import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

import {MessageDto} from "../../../../../lib/models/message.model";
import {AppStatusTypes} from "../../models/app-status-types";
import {MessageTypes} from "../../../../../lib/constants";

declare var port: any;
declare var chrome: any;

@Injectable({
  providedIn: 'root'
})
export class ExtensionConnectService {
  private rawData$ = new BehaviorSubject<MessageDto[]>([]);
  private appStatus$ = new BehaviorSubject<AppStatusTypes>(AppStatusTypes.RECEIVING);

  public init(): void {
    try {
      const tabId = chrome.devtools.inspectedWindow.tabId;
      const port = chrome.runtime.connect(null, { name: `panel-${tabId}` });

      port.onMessage.addListener((data: MessageDto) => {
        this.handleMessage(data);
      });
    } catch (e) {
      console.warn('Port not defined, run in devtools');
    }
  }

  public get data$(): Observable<MessageDto[]> {
    return this.rawData$.asObservable();
  }

  public startReceiving(): void {
    this.appStatus$.next(AppStatusTypes.RECEIVING);
  }

  public stopReceiving(): void {
    this.appStatus$.next(AppStatusTypes.STOPPED);
  }

  public resetData(): void {
    this.rawData$.next([]);
    console.log('reload');
  }

  private handleMessage(message: MessageDto): void {
    switch (message.type) {
      case MessageTypes.SUBSCRIBE:
      case MessageTypes.UNSUBSCRIBE:
        this.handleDataFromPort(message);
        break;
      case MessageTypes.RELOAD:
        this.resetData();
        break;
    }
  }

  private handleDataFromPort(data: MessageDto): void {
    if (this.appStatus$.value === AppStatusTypes.RECEIVING) {
      this.rawData$.next([...this.rawData$.value, data]);
    }
  }
}
