'use client';

import React, { useState } from 'react';
import { DiyaState } from '@/types';
import { Diya } from './Diya';

interface DiyaGridProps {
  celebrationId: string;
  diyas: DiyaState[];
  onLightDiya: (position: number) => Promise<void>;
  isLoading?: boolean;
}

export const DiyaGrid: React.FC<DiyaGridProps> = ({
  diyas,
  onLightDiya,
  isLoading = false,
}) => {
  const [lightingPosition, setLightingPosition] = useState<number | null>(null);

  const handleDiyaClick = async (position: number) => {
    // Don't allow lighting if already lit or currently lighting another
    if (diyas[position]?.isLit || lightingPosition !== null || isLoading) {
      return;
    }

    setLightingPosition(position);
    
    try {
      await onLightDiya(position);
    } catch (error) {
      console.error('Failed to light diya:', error);
    } finally {
      setLightingPosition(null);
    }
  };

  // Calculate grid layout based on number of diyas
  const getGridColumns = () => {
    const totalDiyas = diyas.length;
    if (totalDiyas <= 9) return 'grid-cols-3';
    if (totalDiyas <= 16) return 'grid-cols-4';
    if (totalDiyas <= 36) return 'grid-cols-6';
    if (totalDiyas <= 64) return 'grid-cols-8';
    return 'grid-cols-9 md:grid-cols-12';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div 
        className={`grid ${getGridColumns()} gap-3 md:gap-4 justify-items-center`}
        role="grid"
        aria-label="Diya lighting grid"
      >
        {diyas.map((diya, index) => (
          <Diya
            key={index}
            position={index}
            isLit={diya.isLit}
            userName={diya.userName}
            isLighting={lightingPosition === index}
            onClick={() => handleDiyaClick(index)}
            disabled={diya.isLit || lightingPosition !== null || isLoading}
          />
        ))}
      </div>
    </div>
  );
};
