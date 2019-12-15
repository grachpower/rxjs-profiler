export type SlotItemType = [string, string, string, number, number];

export interface SlotItemModel {
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  isEnded: boolean;
}
