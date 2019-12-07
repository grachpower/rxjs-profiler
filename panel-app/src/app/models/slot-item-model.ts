export type SlotItemType = [string, string, string, Date, Date];

export interface SlotItemModel {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isEnded: boolean;
}
