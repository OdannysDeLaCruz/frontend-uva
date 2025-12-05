import React from 'react';
import CircleMetric from './CircleMetric';

interface CircularMetricCard {
  label: string;
  value: number | string;
}

interface CircularMetricsSectionProps {
  title: string;
  metrics: CircularMetricCard[];
}

const CircularMetricsSection: React.FC<CircularMetricsSectionProps> = ({ title, metrics }) => {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl text-white flex text-nowrap">
          <span className="mr-8 flex text-nowrap">{title}</span>
          <div className="w-full h-[1px] bg-blue-200"></div>
        </h3>
      </div>

      <div className="flex gap-8 justify-center items-end flex-wrap">
        {metrics.map((metric, index) => (
          <CircleMetric key={index} label={metric.label} value={metric.value} />
        ))}
      </div>
    </div>
  );
};

export default CircularMetricsSection;
