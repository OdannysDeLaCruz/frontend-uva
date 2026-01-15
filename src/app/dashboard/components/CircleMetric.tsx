import Image from 'next/image';
import React from 'react';

interface CircleMetricProps {
  label: string;
  value: number | string;
}

const CircleMetric: React.FC<CircleMetricProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Etiqueta */}
      <div className="mb-1">
        <span className="rounded-lg text-white text-md leading-none border-2 bg-green-600 border-green-600 w-[150px] h-[35px] flex items-center justify-center text-center">
          {label}
        </span>
      </div>

      <div className="relative w-60 flex items-center justify-center">
        {/* Imagen del círculo */}
        <Image src="/images/circulo.png" width={300} height={350} className="w-full" alt="Círculo" />

        {/* Contenido central */}
        <div className="absolute text-center">
          <p className="text-white text-3xl leading-none font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CircleMetric;
