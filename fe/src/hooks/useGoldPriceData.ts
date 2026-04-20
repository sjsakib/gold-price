import { useMemo } from 'react';
import { DateTime } from 'luxon';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import data from '../prices.csv';

export const GRAMS_PER_BHORI = 11.664;

export type FilterType = 'all time' | 'year' | 'month';
export type UnitType = 'gram' | 'bhori';

export interface PriceData {
  date: number;
  traditional: number;
  k18: number;
  k21: number;
  k22: number;
}

export interface CSVPriceData {
  date: string;
  traditional: string;
  k18: string;
  k21: string;
  k22: string;
}

export function formatPrice({
  price,
  isBhori = false,
  showFraction = false,
}: {
  price: number;
  isBhori?: boolean;
  showFraction?: boolean;
}) {
  return Intl.NumberFormat('en-US', {
    currency: 'BDT',
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: showFraction ? 1 : 0,
    notation: isBhori ? 'compact' : 'standard',
  }).format(price * (isBhori ? GRAMS_PER_BHORI : 1));
}

export function useGoldPriceData(filter: FilterType, unit: UnitType) {
  const priceData: PriceData[] = useMemo(
    () =>
      data
        .map((d: CSVPriceData) => ({
          date: DateTime.fromISO(d.date).toMillis(),
          k22: Number(d.k22),
          k21: Number(d.k21),
          k18: Number(d.k18),
          traditional: Number(d.traditional),
        }))
        .filter((d: PriceData) => {
          switch (filter) {
            case 'year':
              return d.date > DateTime.local().minus({ year: 1 }).toMillis();
            case 'month':
              return d.date > DateTime.local().minus({ month: 1 }).toMillis();
            default:
              return true;
          }
        })
        .sort((a: PriceData, b: PriceData) => a.date - b.date),
    [filter]
  );

  const priceDataMap = useMemo(
    () =>
      priceData.reduce((acc: Record<number, PriceData>, d) => {
        acc[d.date] = d;
        return acc;
      }, {}),
    [priceData]
  );

  const isBhori = unit === 'bhori';
  const lastPrice = priceData[priceData.length - 1];

  return {
    priceData,
    priceDataMap,
    lastPrice,
    isBhori,
    formatPrice,
  };
} 