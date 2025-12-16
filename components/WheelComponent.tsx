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
      // 1. Select Random Segment
      const randomSegmentIndex = Math.floor(Math.random() * numSegments);
      
      // 2. Calculate current angle normalized (0-360) based on previous total rotation
      const currentRotation = rotation;
      const currentAngle = currentRotation % 360;

      // 3. Determine Target Angle
      const sectorCenter = (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);
      
      // Target visual angle
      const targetAngle = 360 - sectorCenter;

      // 4. Calculate Distance to Travel (Delta)
      let distance = targetAngle - currentAngle;
      
      if (distance < 0) {
        distance += 360;
      }

      // 5. Add Extra Spins for Effect
      const extraSpins = 5 * 360; // 5 full rotations

      // 6. Add Random Jitter (Safe Zone)
      const safeZone = segmentAngle * 0.8; 
      const randomOffset = (Math.random() * safeZone) - (safeZone / 2);

      // 7. Compute Final Rotation
      const finalRotation = currentRotation + extraSpins + distance + randomOffset;
      
      setRotation(finalRotation);

      const spinDuration = 4000; // 4s matches CSS transition

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
                            writingMode: 'vertical-rl', 
                            textOrientation: 'mixed',
                            height: '42%',
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent: 'flex-start',
                            textShadow: sector.type === WheelSectorType.BANKRUPT ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                        }}
                     >
                        {sector.label}
                     </span>
                </div>
            </React.Fragment>
          );
        })}
        
        {/* Bottle Cap Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-2xl">
            {/* The Cap Shape */}
            <div className="w-20 h-20 bg-coke-red rounded-full border-[3px] border-dashed border-white flex items-center justify-center shadow-md box-border">
                 <div className="w-full text-center">
                    <span className="text-white font-bold text-sm italic tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>Coca-Cola</span>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};