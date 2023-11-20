import { useMemo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import data from './prices.csv';
import './App.css';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DateTime } from 'luxon';
import { TooltipProps } from 'recharts/types/component/Tooltip';
import GitHubButton from 'react-github-btn';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

interface PriceData {
  date: number;
  traditional: number;
  k18: number;
  k21: number;
  k22: number;
}

interface CSVPriceData {
  date: string;
  traditional: string;
  k18: string;
  k21: string;
  k22: string;
}

function formatPrice({
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
  }).format(price * (isBhori ? 11.664 : 1));
}

const filters = ['all time', 'year', 'month'] as const;
const units = ['gram', 'bhori'] as const;

function App() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all time');

  const [unit, setUnit] = useState<(typeof units)[number]>('bhori');

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

  function renderToolTip(data: TooltipProps<string, number>) {
    const priceData = priceDataMap[data.label];

    if (!priceData) return null;

    const { k18, k21, k22, traditional } = priceData;

    function getFormattedPrice(price: number) {
      return formatPrice({ price, isBhori, showFraction: isBhori });
    }

    return (
      <div className='tooltip'>
        <span className='tooltip-date'>
          {DateTime.fromMillis(data.label).toFormat('LLL dd, yyyy')}
        </span>{' '}
        <br />
        <span>22K: {getFormattedPrice(k22)}</span> <br />
        <span>21K: {getFormattedPrice(k21)}</span> <br />
        <span>18K: {getFormattedPrice(k18)}</span> <br />
        <span>সনাতন: {getFormattedPrice(traditional)}</span> <br />
      </div>
    );
  }

  const lastPrice = priceData[priceData.length - 1];

  return (
    <div className='container'>
      <h1>Gold Price History in Bangladesh</h1>
      <ResponsiveContainer width='98%' aspect={2}>
        <AreaChart data={priceData}>
          <defs>
            <linearGradient id='goldGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#FFD700' stopOpacity={0.8} />
              <stop offset='95%' stopColor='#ffd7004f' stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type='monotone'
            dataKey='k21'
            stroke='#FFD700'
            fillOpacity={1}
            fill='url(#goldGrad)'
          />
          <XAxis
            dataKey='date'
            type='number'
            domain={['dataMin', 'dataMax']}
            tickFormatter={d =>
              DateTime.fromMillis(d).toFormat(filter === 'month' ? 'LLL dd' : 'LLL yyyy')
            }
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={['auto']}
            tickFormatter={d => formatPrice({ price: d, isBhori, showFraction: false })}
          />
          <Tooltip content={renderToolTip} />
        </AreaChart>
      </ResponsiveContainer>
      <div className='button-group'>
        {filters.map(f => (
          <button
            className={f === filter ? 'active' : ''}
            key={f}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className='button-group'>
        {units.map(u => (
          <button
            className={u === unit ? 'active' : ''}
            key={u}
            onClick={() => setUnit(u)}
          >
            {u}
          </button>
        ))}
      </div>
      <table>
        <thead>
          <tr>
            <th>22K</th>
            <th>21K</th>
            <th>18K</th>
            <th>সনাতন</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {(['k22', 'k21', 'k18', 'traditional'] as const).map(k => (
              <td key={k}>
                {formatPrice({
                  price: lastPrice[k],
                  isBhori,
                })}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className='last-price'>
        Last updated: {DateTime.fromMillis(lastPrice.date).toFormat('LLLL dd, yyyy')}{' '}
      </p>
      <p className='info'>
        * Prices are collected from{' '}
        <a
          target='_blank'
          rel='noreferrer noopener'
          href='https://www.bajus.org/gold-price'
        >
          Bangladesh Jewellers Association website
        </a>
        <br />
        * There is a 5% VAT on all gold purchases in Bangladesh <br />* If purchased in
        jewelry form, there is additional making charges
      </p>
      <p>
        <GitHubButton
          href='https://github.com/sjsakib/gold-price'
          data-icon='octicon-star'
          aria-label='Star sjsakib/gold-price on GitHub'
          data-show-count={true}
        >
          Star
        </GitHubButton>
      </p>
    </div>
  );
}

export default App;
