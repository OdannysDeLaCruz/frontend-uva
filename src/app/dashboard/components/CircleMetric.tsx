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
        <span className="rounded-lg text-white text-[10px] sm:text-xs md:text-sm leading-none border-2 bg-green-600 border-green-600 w-[90px] sm:w-[110px] md:w-[130px] h-[28px] sm:h-[30px] md:h-[35px] flex items-center justify-center text-center px-1">
          {label}
        </span>
      </div>

      <div className="relative w-24 sm:w-36 md:w-44 lg:w-52 flex items-center justify-center">
        {/* Imagen del círculo */}
        <Image src="/images/circulo.png" width={300} height={350} className="w-full" alt="Círculo" />

        {/* Contenido central */}
        <div className="absolute text-center px-1">
          <p className="text-white text-sm sm:text-lg md:text-xl lg:text-2xl leading-none font-bold">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CircleMetric;
