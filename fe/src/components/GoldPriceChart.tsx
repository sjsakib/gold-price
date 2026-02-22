import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DateTime } from 'luxon';
import { TooltipProps } from 'recharts/types/component/Tooltip';
import React from 'react';
import { PriceData } from '../hooks/useGoldPriceData';

type GoldPriceChartProps = {
  priceData: PriceData[];
  priceDataMap: Record<number, PriceData>;
  filter: string;
  isBhori: boolean;
  formatPrice: (args: { price: number; isBhori?: boolean; showFraction?: boolean }) => string;
};

const GoldPriceChart: React.FC<GoldPriceChartProps> = ({ priceData, priceDataMap, filter, isBhori, formatPrice }) => {
  function renderToolTip(data: TooltipProps<string, number>) {
    const priceDataItem = priceDataMap[data.label];
    if (!priceDataItem) return null;
    const { k18, k21, k22, traditional } = priceDataItem;
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

  return (
    <ResponsiveContainer width='98%' aspect={2}>
      <AreaChart data={priceData}>
        <defs>
          <linearGradient id='goldGrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#FFD700' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#ffd7004f' stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type='bump'
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
  );
};

export default GoldPriceChart; 