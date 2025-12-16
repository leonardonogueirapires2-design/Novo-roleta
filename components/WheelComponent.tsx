import React, { useState, useEffect, useRef } from 'react';
import { WheelSector } from '../types';
import { WHEEL_SECTORS } from '../constants';

interface WheelComponentProps {
  onSpinEnd: (sector: WheelSector) => void;
  isSpinning: boolean;
  disabled: boolean;
}

export const WheelComponent: React.FC<WheelComponentProps> = ({ onSpinEnd, isSpinning, disabled }) => {
  const [rotation, setRotation] = useState(0);
  
  // Total segments
  const numSegments = WHEEL_SECTORS.length;
  const segmentAngle = 360 / numSegments;

  // Generate Conic Gradient
  const gradientParts = WHEEL_SECTORS.map((sector, index) => {
    const start = index * segmentAngle;
    const end = (index + 1) * segmentAngle;
    return `${sector.color} ${start}deg ${end}deg`;
  });
  const background = `conic-gradient(from 0deg, ${gradientParts.join(', ')})`;

  useEffect(() => {
    if (isSpinning) {
      const randomSegmentIndex = Math.floor(Math.random() * numSegments);
      const currentRotation = rotation;
      const currentAngle = currentRotation % 360;
      
      // Calculate target rotation
      const sectorCenter = (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);
      const targetAngle = 360 - sectorCenter;

      let distance = targetAngle - currentAngle;
      while (distance < 360) distance += 360;

      const extraSpins = 5 * 360; // 5 full turns
      
      const safeZone = segmentAngle * 0.8; 
      const randomOffset = (Math.random() * safeZone) - (safeZone / 2);

      const finalRotation = currentRotation + extraSpins + distance + randomOffset;
      
      setRotation(finalRotation);

      const spinDuration = 4000;

      setTimeout(() => {
        onSpinEnd(WHEEL_SECTORS[randomSegmentIndex]);
      }, spinDuration);
    }
  }, [isSpinning]);

  return (
    // Increased standard size from w-80 to w-[340px] and md size to w-[500px]
    <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] flex items-center justify-center my-4 scale-100 transition-transform duration-500">
      
      {/* 
        POINTER (The Flapper) 
        Located at the top center. 
      */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-30 filter drop-shadow-xl">
        {/* The metallic housing for the pointer */}
        <div className="w-14 h-14 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full border-4 border-white shadow-md flex items-center justify-center relative">
            <div className="w-8 h-8 bg-coke-red rounded-full border-2 border-red-800 shadow-inner"></div>
        </div>
        {/* The actual needle - slightly larger */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[32px] border-t-coke-red filter drop-shadow-sm"></div>
      </div>

      {/* 
        WHEEL FRAME 
      */}
      
      {/* 1. Outer Chrome Rim */}
      <div className="absolute inset-[-16px] rounded-full bg-gradient-to-br from-gray-300 via-white to-gray-400 border border-gray-400 shadow-2xl"></div>
      
      {/* 2. Dark Gap/Housing */}
      <div className="absolute inset-[-8px] rounded-full bg-coke-black border border-gray-700"></div>

      {/* 3. Inner Red Ring (The Wheel Base) */}
      <div className="absolute inset-0 rounded-full bg-coke-red shadow-inner"></div>

      {/* 
        ROTATING PART 
      */}
      <div
        className="w-full h-full rounded-full border-[4px] border-white/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.3)] overflow-hidden relative"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.2, 1)' : 'none',
          background: background
        }}
      >
        {WHEEL_SECTORS.map((sector, index) => {
          const rotation = index * segmentAngle;
          const centerRotation = rotation + (segmentAngle / 2);

          return (
            <React.Fragment key={index}>
                {/* Separator Lines */}
                <div 
                    className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-black/20 -translate-x-1/2 origin-bottom z-10"
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
                
                {/* Text Label */}
                <div 
                    className="absolute top-0 left-0 w-full h-full flex justify-center pt-4 md:pt-6"
                    style={{ transform: `rotate(${centerRotation}deg)` }}
                >
                     <span 
                        className="font-black tracking-tighter select-none drop-shadow-sm text-lg md:text-3xl"
                        style={{
                            color: sector.textColor,
                            writingMode: 'vertical-rl', 
                            textOrientation: 'upright',
                            height: '55%', // Allowed more height for text to fit larger font
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent: 'flex-start',
                            textShadow: sector.textColor === '#FFFFFF' ? '0 2px 4px rgba(0,0,0,0.6)' : 'none',
                            fontFamily: "'Arial Black', 'Helvetica Black', sans-serif"
                        }}
                     >
                        {sector.label}
                     </span>
                </div>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* 
        CENTER HUB 
        Larger to match new wheel size
      */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center border-4 border-gray-400">
              {/* Inner Red Button */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-coke-red to-coke-darkRed rounded-full border-2 border-white/30 shadow-inner flex items-center justify-center">
                  <span className="text-white font-serif italic font-bold text-xl md:text-2xl drop-shadow-md">Coke</span>
              </div>
              
              {/* Gloss shine */}
              <div className="absolute top-2 left-4 right-4 h-10 bg-white/40 rounded-full blur-[2px]"></div>
          </div>
      </div>

    </div>
  );
};