import React, { useEffect, useRef, useState } from 'react';
import { MiniMapProps, MiniMapState } from "@/src/types";
import { UserCurrentPosition } from '@/src/constants';
import Image from 'next/image';

const MiniMap: React.FC<MiniMapProps> = ({
  url,
  cursor,
  setPoint,
  currentPosition,
  point,
}) => {
  const miniMapRef = useRef<HTMLDivElement | null>(null);
  const [miniMapStyle, setMiniMapStyle] = useState<MiniMapState>({ transform: 'rotate(0rad)' });

  useEffect(() => {
    if (miniMapRef.current) {
      const { transform } = calculateMiniMapPosition(currentPosition);
      setMiniMapStyle({ transform: transform });
    }
  }, [currentPosition]);

  const calculateMiniMapPosition = (position: { x: number; z: number }) => {
    const angle = Math.atan2(position.z, position.x); // Use atan2 for correct angle calculation
    const adjustedAngle = angle + Math.PI / 2; // Adjust the angle by subtracting 90 degrees (PI/2 radians) for the inverse effect
    return {
      transform: `rotate(${adjustedAngle}rad)`,
    };
  };

  const changeFloor = (newFloor: number) => {
    setPoint(newFloor);
  };

  return (
    <div
      ref={miniMapRef}
      style={{
        position: 'fixed',
        width: '220px',
        height: '220px',
        backgroundSize: 'cover',
        right: '10px',
        bottom: '10px',
      }}
      className={'p-4 bg-[#0005]'}
    >
      <Image
        className={'w-full h-full object-cover'}
        src={url}
        alt="MAP"
        width={220}
        height={220}
      />
      <div
        style={{
          position: 'absolute',
          width: '50px',
          height: '50px',
          backgroundImage: `url(${cursor})`,
          backgroundSize: 'cover',
          top: UserCurrentPosition[point].top,
          left: UserCurrentPosition[point].left,
          ...miniMapStyle,
        }}
        className={`transition-transform duration-500`}
      ></div>
      <div className="absolute top-0 left-0 w-full h-10 flex justify-around items-center border-b border-white">
        <div onClick={() => changeFloor(1)} className="px-2 py-1 bg-black bg-opacity-25 hover:bg-opacity-50 text-white">Floor 1</div>
        <button onClick={() => changeFloor(2)} className="px-2 py-1 bg-black bg-opacity-25 hover:bg-opacity-50 text-white">Floor 2</button>
      </div>
    </div>
  );
};

export default MiniMap;
