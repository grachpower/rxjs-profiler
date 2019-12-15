import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";

import {ExtensionConnectService} from "../extension-connect/extension-connect.service";
import {SlotItemModel, SlotItemType} from "../../models/slot-item-model";
import {MessageDto} from "../../../../../lib/models/message.model";
import {MessageTypes} from "../../../../../lib/constants";
import {FilterTypes} from "../../models/filter-types";

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private _searchValue$ = new BehaviorSubject<string>('');
  private _selectedFilter$ = new BehaviorSubject<FilterTypes>(FilterTypes.ALL);

  constructor(
    private extensionConnect: ExtensionConnectService,
  ) { }

  public get timelineData$(): Observable<SlotItemType[]> {
    return combineLatest([
      this.extensionConnect.data$,
      this._searchValue$,
      this._selectedFilter$,
    ])
      .pipe(
        switchMap(([items, search, filters]: [MessageDto[], string, FilterTypes]) => {
          if (items.length === 0) {
            return of([]);
          }

          const loweredSearch = search.toLowerCase();

          const result: SlotItemModel[] = this.transformRawDataToSlots(items);
          const filteredResult = result
            .filter((model: SlotItemModel) => {
              return model.name.toLowerCase().includes(loweredSearch);
            })
            .filter((model: SlotItemModel) => {
              if (filters === FilterTypes.ALL) {
                return true;
              }

              if (filters === FilterTypes.FINISHED) {
                return model.isEnded;
              }

              if (filters === FilterTypes.PENDING) {
                return !model.isEnded;
              }
            });

          const mappedArrays = this.transformSlotModelToSlotType(filteredResult);

          console.log('items: ', mappedArrays);

          return of(mappedArrays);
        }),
      );
  }

  public setSearchValue(search: string): void {
    this._searchValue$.next(search);
  }

  public get searchValue$(): Observable<string> {
    return this._searchValue$.asObservable();
  }

  public setFilterType(type: FilterTypes): void {
    this._selectedFilter$.next(type);
  }

  public get filterType$(): Observable<FilterTypes> {
    return this._selectedFilter$.asObservable();
  }

  private transformRawDataToSlots(items: MessageDto[]): SlotItemModel[] {
    const subItems = items.filter((item: MessageDto) => item.type === MessageTypes.SUBSCRIBE);
    const unsubItems = items.filter((item: MessageDto) => item.type === MessageTypes.UNSUBSCRIBE);

    const initialModels: SlotItemModel[] = subItems.map((item: MessageDto) => {
      const newData = item.date + 2;

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

    return outerModels;
  }

  private transformSlotModelToSlotType(models: SlotItemModel[]): SlotItemType[] {

    return models.map((model: SlotItemModel) => ['all', `[${model.name}]:  ${model.description}` , null , model.startDate, model.endDate] as SlotItemType);
  }
}
