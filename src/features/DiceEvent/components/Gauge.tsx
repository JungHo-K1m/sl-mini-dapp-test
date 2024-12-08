//src\features\DiceEvent\components\Gauge.tsx

import React from 'react';
import GaugeComponent from 'react-gauge-component';

const Gauge: React.FC<{ gaugeValue: number }> = ({ gaugeValue }) => (
  <GaugeComponent
    className="z-0 w-64 -top-4 absolute md:w-96 md:top-2 max-h-24"
    type="semicircle"
    value={(gaugeValue / 6) * 6}
    maxValue={6}
    arc={{
      colorArray: ['#ffffff', '#FF2121'],
      padding: 0.02,
      subArcs: [
        { limit: 1 },
        { limit: 2 },
        { limit: 3 },
        { limit: 4 },
        { limit: 5 },
        { limit: 6 },
      ],
    }}
    pointer={{
      type: 'blob',
      animationDelay: 0,
      animationDuration: 0,
    }}
    labels={{
      valueLabel: { hide: true },
      tickLabels: { hideMinMax: true, ticks: [] },
    }}
  />
);

export default Gauge;
