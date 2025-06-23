export enum LimitType {
  NONE = 'NONE',
  PER_ACT = 'PER_ACT',
  PER_DAY = 'PER_DAY',
  PER_YEAR = 'PER_YEAR',
}

export const LimitTypeLabels: Record<LimitType, string> = {
  [LimitType.NONE]: 'No Limit',
  [LimitType.PER_ACT]: 'Per Act',
  [LimitType.PER_DAY]: 'Per Day',
  [LimitType.PER_YEAR]: 'Per Year',
};
