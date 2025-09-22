import React from 'react';
import './Bit.css';

const BIT_SIZE = 12;

interface BitProps {
  bit: {
    id: number;
    x: number;
    y: number;
  };
}

const Bit: React.FC<BitProps> = ({ bit }) => {
  return (
    <div
      className="absolute bit-container"
      style={{
        left: bit.x,
        top: bit.y,
        width: BIT_SIZE,
        height: BIT_SIZE,
      }}
    >
      <div className="bit">
        <div className="side front"></div>
        <div className="side back"></div>
      </div>
    </div>
  );
};

export default Bit;
