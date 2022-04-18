
/// <reference path="./locales.d.ts" />


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

export interface Locale {
  id: LocaleId;
  data: any;
}

export interface Formatter {
  format(firstDate: Date | number, secondDate: Date | number, options?: Config): string;
}

export function create(config?: Config): Formatter;

export function addLocale(localeData: (Locale | Locale[]));

export const defaultConfig: Config;
