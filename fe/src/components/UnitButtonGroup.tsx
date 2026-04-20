import React from 'react';

type UnitButtonGroupProps = {
  units: string[];
  activeUnit: string;
  onChange: (unit: string) => void;
};

const UnitButtonGroup: React.FC<UnitButtonGroupProps> = ({ units, activeUnit, onChange }) => (
  <div className='button-group'>
    {units.map(u => (
      <button
        className={u === activeUnit ? 'active' : ''}
        key={u}
        onClick={() => onChange(u)}
      >
        {u}
      </button>
    ))}
  </div>
);

export default UnitButtonGroup; 