import React from 'react';
import { PriceData } from '../hooks/useGoldPriceData';

type PriceTableProps = {
  lastPrice: PriceData;
  isBhori: boolean;
  formatPrice: (args: { price: number; isBhori?: boolean }) => string;
};

const keys = ['k22', 'k21', 'k18', 'traditional'] as const;

const PriceTable: React.FC<PriceTableProps> = ({ lastPrice, isBhori, formatPrice }) => (
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
        {keys.map(k => (
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
);

export default PriceTable; 