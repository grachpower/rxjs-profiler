import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";

import {ExtensionConnectService} from "../extension-connect/extension-connect.service";
import {SlotItemModel, SlotItemType} from "../../models/slot-item-model";
import {MessageDto} from "../../../../../lib/models/message.model";
import {MessageTypes} from "../../../../../lib/constants";

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

        return of(this.transformRawDataToSlots(items));
      }),
    );
  }

  private transformRawDataToSlots(items: MessageDto[]): SlotItemType[] {
    const subItems = items.filter((item: MessageDto) => item.type === MessageTypes.SUBSCRIBE);
    const unsubItems = items.filter((item: MessageDto) => item.type === MessageTypes.UNSUBSCRIBE);

    const initialModels: SlotItemModel[] = subItems.map((item: MessageDto) => {
      const newData = item.date + 1;

      return {
        name: item.name,
        description: item.trace,
        isEnded: false,
        startDate: item.date,
        endDate: newData,
      };
    });

    const outerModels: SlotItemModel[] = initialModels.map((item: SlotItemModel) => {
      const endItem = unsubItems.find((unsubElem: MessageDto) => unsubElem.name == item.name);

      const newDate = Date.now();

      if (!endItem) {
        return {
          ...item,
          endDate: newDate,
        };
      } else {
        const endDate = endItem.date >= item.endDate ? endItem.date : item.endDate;

        return {
          name: item.name,
          description: item.description,
          isEnded: true,
          startDate: item.startDate,
          endDate: endDate,
        }
      }
    });

    const results = this.transformSlotModelToSlotType(outerModels);

    console.log('items: ', results);

    return results;
  }

  private transformSlotModelToSlotType(models: SlotItemModel[]): SlotItemType[] {

    return models.map((model: SlotItemModel) => ['all', `[${model.name}]:  ${model.description}` , null , model.startDate, model.endDate] as SlotItemType);
  }
}
