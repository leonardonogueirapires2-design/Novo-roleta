import React, { useState, useEffect, useRef } from 'react';
import { WheelSector, WheelSectorType } from '../types';
import { WHEEL_SECTORS } from '../constants';

interface WheelComponentProps {
  onSpinEnd: (sector: WheelSector) => void;
  isSpinning: boolean;
  disabled: boolean;
}

export const WheelComponent: React.FC<WheelComponentProps> = ({ onSpinEnd, isSpinning, disabled }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Total segments
  const numSegments = WHEEL_SECTORS.length;
  const segmentAngle = 360 / numSegments;

  // Generate Conic Gradient for the background
  const gradientParts = WHEEL_SECTORS.map((sector, index) => {
    const start = index * segmentAngle;
    const end = (index + 1) * segmentAngle;
    return `${sector.color} ${start}deg ${end}deg`;
  });
  const background = `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;

  useEffect(() => {
    if (isSpinning) {
      // Calculate a random landing spot
      const randomSegmentIndex = Math.floor(Math.random() * numSegments);
      const extraSpins = 5;
      const baseAngle = 360 * extraSpins;
      
      // Target the CENTER of the segment
      const sectorCenter = (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);
      
      // Calculate rotation to bring this center to 0deg (top)
      // We subtract the sector position from 360 to rotate it backwards to the top
      const targetRotation = 360 - sectorCenter;

      // Add randomness within the sector (keep away from edges by 10%)
      const safeZone = segmentAngle * 0.8;
      const randomOffset = (Math.random() * safeZone) - (safeZone / 2);
      
      const finalRotation = rotation + baseAngle + targetRotation + randomOffset;
      
      setRotation(finalRotation);

      const spinDuration = 4000; // 4s

      setTimeout(() => {
        onSpinEnd(WHEEL_SECTORS[randomSegmentIndex]);
      }, spinDuration);
    }
  }, [isSpinning]);

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center my-8">
      {/* Pointer */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 filter drop-shadow-xl">
        <div className="w-8 h-12 bg-yellow-400 border-2 border-white clip-path-polygon" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
      </div>

      {/* Outer Rim (Coca-Cola Red Border) */}
      <div className="absolute inset-[-12px] rounded-full bg-coke-red border-4 border-white shadow-2xl"></div>

      {/* Wheel Container */}
      <div
        ref={wheelRef}
        className="w-full h-full rounded-full border-[6px] border-white shadow-inner overflow-hidden relative transition-transform cubic-bezier(0.15, 0, 0.2, 1)"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionDuration: isSpinning ? '4000ms' : '0ms',
          background: background
        }}
      >
        {WHEEL_SECTORS.map((sector, index) => {
          const rotation = index * segmentAngle;
          const centerRotation = rotation + (segmentAngle / 2);

          return (
            <React.Fragment key={index}>
                {/* Separator Line */}
                <div 
                    className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-black/10 -translate-x-1/2 origin-bottom z-10"
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
                
                {/* Text Label - Centered in slice */}
                <div 
                    className="absolute top-0 left-0 w-full h-full flex justify-center pt-3 md:pt-5"
                    style={{ transform: `rotate(${centerRotation}deg)` }}
                >
                     <span 
                        className="font-black text-sm md:text-lg tracking-tight select-none"
                        style={{
                            color: sector.textColor,
                            writingMode: 'vertical-rl', // Makes text run down
                            textOrientation: 'mixed',
                            height: '42%', // Occupy outer part of the wheel
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent: 'flex-start', // Start from top
                            textShadow: sector.type === WheelSectorType.BANKRUPT ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                        }}
                     >
                        {sector.label}
                     </span>
                </div>
            </React.Fragment>
          );
        })}
        
        {/* Decorative Center Cap */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-coke-red z-20 flex items-center justify-center shadow-lg">
            <div className="w-10 h-10 bg-coke-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">COCA</span>
            </div>
        </div>
      </div>
    </div>
  );
};
