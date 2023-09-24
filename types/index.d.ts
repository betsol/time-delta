
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
  /**
   *  Returns difference between two dates as a text string.
   */
  format(firstDate: Date | number, secondDate: Date | number, options?: Config): string;

  /**
   *  Returns a millisecond value as a text string.
   */
  format_ms(msDifference: number, options?: Config): string;
}

export function create(config?: Config): Formatter;

/**
 * Adds pluralization data for the specified locale.
 * Should be called in browser.
 */
export function addLocale(localeData: (Locale | Locale[]));

export const defaultConfig: Config;
