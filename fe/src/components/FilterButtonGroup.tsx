import React from 'react';

type FilterButtonGroupProps = {
  filters: string[];
  activeFilter: string;
  onChange: (filter: string) => void;
};

const FilterButtonGroup: React.FC<FilterButtonGroupProps> = ({ filters, activeFilter, onChange }) => (
  <div className='button-group'>
    {filters.map(f => (
      <button
        className={f === activeFilter ? 'active' : ''}
        key={f}
        onClick={() => onChange(f)}
      >
        {f}
      </button>
    ))}
  </div>
);

export default FilterButtonGroup; 