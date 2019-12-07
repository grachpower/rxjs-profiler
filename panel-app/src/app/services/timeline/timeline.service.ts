import {Injectable} from '@angular/core';
import {ExtensionConnectService} from "../extension-connect/extension-connect.service";
import {SlotItemModel, SlotItemType} from "../../models/slot-item-model";
import {interval, Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {MessageDto} from "../../../../../lib/models/message.model";
import {MessageTypes} from "../../../../../lib/constants";
import {timelineDataStub} from "./data.stub";

const THROTTLE_TIME = 20;

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(
    private extensionConnect: ExtensionConnectService,
  ) {
  }

  public get timelineData$(): Observable<SlotItemType[]> {
    return this.extensionConnect.data$.pipe(
      switchMap((items: MessageDto[]) => {
        if (items.length === 0) {
          return of([]);
        }

        return interval(THROTTLE_TIME).pipe(
          map(() => this.transformRawDataToSlots(items)),
        );
      }),
    );
  }

  private transformRawDataToSlots(items: MessageDto[]): SlotItemType[] {
    const subItems = items.filter((item: MessageDto) => item.type === MessageTypes.SUBSCRIBE);
    const unsubItems = items.filter((item: MessageDto) => item.type === MessageTypes.UNSUBSCRIBE);

    const currentDate = new Date();

    const initialModels: SlotItemModel[] = subItems.map((item: MessageDto) => {
      return {
        name: item.name,
        description: item.trace,
        isEnded: false,
        startDate: item.date,
        endDate: currentDate,
      };
    });

    const outerModels: SlotItemModel[] = initialModels.map((item: SlotItemModel) => {
      const endItem = unsubItems.find((unsubElem: MessageDto) => unsubElem.name == item.name);

      if (!endItem) {
        return item;
      } else {
        return {
          name: item.name,
          description: item.name,
          isEnded: true,
          startDate: item.startDate,
          endDate: endItem.date,
        }
      }
    });

    return this.transformSlotModelToSlotType(outerModels);
  }

  private transformSlotModelToSlotType(models: SlotItemModel[]): SlotItemType[] {
    return models.map((model: SlotItemModel) => ['all', model.name, model.description, model.startDate, model.endDate] as SlotItemType);
  }
}
