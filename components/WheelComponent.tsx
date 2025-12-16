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
      
      // Calculate where the pointer lands
      // The pointer is at the TOP (270 degrees in CSS rotation logic usually, 
      // but here we just align the target segment to the top).
      // If we want segment X to be at top, we rotate the wheel such that segment X is at -90deg (or 270deg).
      
      // Center of the target segment
      const sectorCenter = (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);
      
      // Calculate target rotation to bring sectorCenter to the top (0deg/360deg is usually right, so -90 is top)
      // Standard CSS rotate: 0 is top.
      // Wait, conic-gradient starts 0 at top. 
      // So to get sector center to top: Target Rotation = 360 - sectorCenter.
      const targetAngle = 360 - sectorCenter;

      let distance = targetAngle - currentAngle;
      // Ensure we always spin forward significantly
      while (distance < 360) distance += 360;

      const extraSpins = 5 * 360; // 5 full turns
      
      // Add a tiny random offset to make it look analog (not landing perfectly in center every time)
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
    <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center my-4 scale-100 transition-transform duration-500">
      
      {/* 
        POINTER (The Flapper) 
        Located at the top center. 
      */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-30 filter drop-shadow-xl">
        {/* The metallic housing for the pointer */}
        <div className="w-12 h-12 bg-gradient-to-b from-gray-200 to-gray-400 rounded-full border-2 border-white shadow-md flex items-center justify-center relative">
            <div className="w-8 h-8 bg-coke-red rounded-full border-2 border-red-800 shadow-inner"></div>
        </div>
        {/* The actual needle */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-coke-red filter drop-shadow-sm"></div>
      </div>

      {/* 
        WHEEL FRAME 
        Multiple rings to create a 3D machine look
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
                    className="absolute top-0 left-0 w-full h-full flex justify-center pt-3"
                    style={{ transform: `rotate(${centerRotation}deg)` }}
                >
                     <span 
                        className="font-black text-sm md:text-lg tracking-tight select-none drop-shadow-sm"
                        style={{
                            color: sector.textColor,
                            writingMode: 'vertical-rl', 
                            textOrientation: 'upright', // Keeps letters upright
                            height: '45%', // Keep text in outer half
                            display: 'flex',
                            alignItems: 'center', 
                            justifyContent: 'flex-start',
                            textShadow: sector.textColor === '#FFFFFF' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
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
        A shiny branded button in the middle
      */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center justify-center border-4 border-gray-400">
              {/* Inner Red Button */}
              <div className="w-16 h-16 bg-gradient-to-br from-coke-red to-coke-darkRed rounded-full border-2 border-white/30 shadow-inner flex items-center justify-center">
                  <span className="text-white font-serif italic font-bold text-lg drop-shadow-md">Coke</span>
              </div>
              
              {/* Gloss shine on top half */}
              <div className="absolute top-2 left-4 right-4 h-8 bg-white/40 rounded-full blur-[2px]"></div>
          </div>
      </div>

    </div>
  );
};