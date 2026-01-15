import React from 'react';

interface MetricCard {
  label: string;
  value: number | string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

interface MetricsSectionProps {
  title: string;
  metrics: MetricCard[];
  subtitle?: string;
  layout?: 'grid' | 'flex'; // 'grid' para 2+ items, 'flex' para items en fila
}

const colorClasses = {
  blue: 'bg-blue-600 border-blue-500 text-blue-300',
  green: 'bg-green-600 border-green-500 text-green-300',
  purple: 'bg-purple-600 border-purple-500 text-purple-300',
  orange: 'bg-orange-600 border-orange-500 text-orange-300',
  red: 'bg-red-600 border-red-500 text-red-300',
  yellow: 'bg-yellow-600 border-yellow-500 text-yellow-300',
};

const MetricsSection: React.FC<MetricsSectionProps> = ({
  title,
  metrics,
  subtitle,
  layout = 'flex',
}) => {
  const containerClass = layout === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex gap-6 justify-center flex-wrap';

  return (
    <div className="w-full mb-10">
      <div className="flex items-center mb-8">
        <h3 className="text-3xl text-white flex text-nowrap">
          {title}
        </h3>
        {!subtitle && <div className="w-full h-[1px] bg-blue-200 ml-8"></div>}
      </div>
      {subtitle && (
        <p className="text-gray-300 text-sm mb-6">{subtitle}</p>
      )}

      <div className={containerClass}>
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border-2 text-center transition-all duration-200 hover:shadow-lg ${
              colorClasses[metric.color || 'blue']
            }`}
          >
            <p className="text-lg font-semibold mb-3 uppercase tracking-wide">
              {metric.label}
            </p>
            <p className="text-4xl font-bold text-white">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsSection;
