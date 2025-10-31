'use client';
import React from 'react';

type LoadingSpinnerProps = {
  size?: number;
  color?: string;
};

const LoadingSpinner = ({ size = 40, color = 'blue' }: LoadingSpinnerProps) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div
        className={`animate-spin rounded-full border-t-4 border-b-4 border-${color}-500`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
