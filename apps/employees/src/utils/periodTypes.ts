export enum PERIOD_TYPE {
  ALL = "all",
  THIS_WEEK = "thisWeek",
  LAST_WEEK = "lastWeek",
  THIS_MONTH = "thisMonth",
  LAST_MONTH = "lastMonth",
  THIS_YEAR = "thisYear",
  LAST_YEAR = "lastYear",
  CUSTOM = "custom",
}

export const PeriodTypeLabelMap: Record<PERIOD_TYPE, string> = {
  [PERIOD_TYPE.ALL]: "Wszystko",
  [PERIOD_TYPE.THIS_WEEK]: "W tym tygodniu",
  [PERIOD_TYPE.LAST_WEEK]: "W poprzednim tygodniu",
  [PERIOD_TYPE.THIS_MONTH]: "W tym miesiącu",
  [PERIOD_TYPE.LAST_MONTH]: "W poprzednim miesiącu",
  [PERIOD_TYPE.THIS_YEAR]: "W tym roku",
  [PERIOD_TYPE.LAST_YEAR]: "W zeszłym roku",
  [PERIOD_TYPE.CUSTOM]: "Inne",
};
