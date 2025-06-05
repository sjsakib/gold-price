import { useState } from 'react';
import './App.css';
import { DateTime } from 'luxon';
import { registerSW } from 'virtual:pwa-register';
import { useGoldPriceData, FilterType, UnitType } from './hooks/useGoldPriceData';
import GoldPriceChart from './components/GoldPriceChart';
import FilterButtonGroup from './components/FilterButtonGroup';
import UnitButtonGroup from './components/UnitButtonGroup';
import PriceTable from './components/PriceTable';
import InfoSection from './components/InfoSection';

registerSW({ immediate: true });

const filters: FilterType[] = ['all time', 'year', 'month'];
const units: UnitType[] = ['gram', 'bhori'];

function App() {
  const [filter, setFilter] = useState<FilterType>('all time');
  const [unit, setUnit] = useState<UnitType>('bhori');

  const { priceData, priceDataMap, lastPrice, isBhori, formatPrice } = useGoldPriceData(filter, unit);

  if (!lastPrice) {
    return <div className='container'>No data available.</div>;
  }

  return (
    <div className='container'>
      <h1>Gold Price History in Bangladesh</h1>
      <GoldPriceChart
        priceData={priceData}
        priceDataMap={priceDataMap}
        filter={filter}
        isBhori={isBhori}
        formatPrice={formatPrice}
      />
      <FilterButtonGroup
        filters={filters}
        activeFilter={filter}
        onChange={f => setFilter(f as FilterType)}
      />
      <UnitButtonGroup
        units={units}
        activeUnit={unit}
        onChange={u => setUnit(u as UnitType)}
      />
      <PriceTable
        lastPrice={lastPrice}
        isBhori={isBhori}
        formatPrice={formatPrice}
      />
      <p className='last-price'>
        Last updated: {DateTime.fromMillis(lastPrice.date).toFormat('LLLL dd, yyyy')}{' '}
      </p>
      <InfoSection />
    </div>
  );
}

export default App;
