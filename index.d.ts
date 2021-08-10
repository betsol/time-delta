
export type LocaleId = string;

export type UnitType = (
  | 'long'
  | 'short'
  | 'narrow'
);

export interface Config {
  locale?: LocaleId,
  span?: number,
  delimiter?: string,
  unitType?: UnitType,
  unitTypeLookupOrder?: UnitType[],
  autoloadLocales?: boolean,
}

export interface LocaleData {
  id: LocaleId;
  data: any;
}

export interface Formatter {
  format(firstDate: Date, secondDate: Date, options?: Config);
}

export function create(config?: Config): Formatter;

export function addLocale(localeData: (LocaleData | LocaleData[]));

export const defaultConfig: Config;
