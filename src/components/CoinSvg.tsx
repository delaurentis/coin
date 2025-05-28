import React from 'react';

interface CoinSvgProps {
  number: number;
  size?: 'normal' | 'small';
}

const CoinSvg: React.FC<CoinSvgProps> = ({ number, size = 'normal' }) => {
  // Set size based on the size prop
  const dimensions = {
    width: size === 'normal' ? 80 : 40,
    height: size === 'normal' ? 80 : 40,
    fontSize: size === 'normal' ? 6 : 4
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      width={dimensions.width} 
      height={dimensions.height}
      style={{ 
      }}
    >
      {/* Perfect pixel art circle with 3D effect */}
      <g>
        {/* Row 1 */}
        <rect x="9" y="2" width="6" height="1" fill="#ffec80" />
        
        {/* Row 2 */}
        <rect x="7" y="3" width="2" height="1" fill="#ffec80" />
        <rect x="9" y="3" width="6" height="1" fill="#ffd700" />
        <rect x="15" y="3" width="2" height="1" fill="#e6b800" />
        
        {/* Row 3 */}
        <rect x="5" y="4" width="2" height="1" fill="#ffec80" />
        <rect x="7" y="4" width="10" height="1" fill="#ffd700" />
        <rect x="17" y="4" width="2" height="1" fill="#e6b800" />
        
        {/* Row 4 */}
        <rect x="4" y="5" width="1" height="1" fill="#ffec80" />
        <rect x="5" y="5" width="14" height="1" fill="#ffd700" />
        <rect x="19" y="5" width="1" height="1" fill="#e6b800" />
        
        {/* Row 5-6 */}
        <rect x="3" y="6" width="1" height="2" fill="#ffec80" />
        <rect x="4" y="6" width="16" height="2" fill="#ffd700" />
        <rect x="20" y="6" width="1" height="2" fill="#e6b800" />
        
        {/* Row 7-16 */}
        <rect x="2" y="8" width="1" height="8" fill="#ffec80" />
        <rect x="3" y="8" width="18" height="8" fill="#ffd700" />
        <rect x="21" y="8" width="1" height="8" fill="#e6b800" />
        
        {/* Row 17-18 */}
        <rect x="3" y="16" width="1" height="2" fill="#ffec80" />
        <rect x="4" y="16" width="16" height="2" fill="#ffd700" />
        <rect x="20" y="16" width="1" height="2" fill="#e6b800" />
        
        {/* Row 19 */}
        <rect x="4" y="18" width="1" height="1" fill="#ffec80" />
        <rect x="5" y="18" width="14" height="1" fill="#ffd700" />
        <rect x="19" y="18" width="1" height="1" fill="#e6b800" />
        
        {/* Row 20 */}
        <rect x="5" y="19" width="2" height="1" fill="#ffec80" />
        <rect x="7" y="19" width="10" height="1" fill="#ffd700" />
        <rect x="17" y="19" width="2" height="1" fill="#e6b800" />
        
        {/* Row 21 */}
        <rect x="7" y="20" width="2" height="1" fill="#ffec80" />
        <rect x="9" y="20" width="6" height="1" fill="#ffd700" />
        <rect x="15" y="20" width="2" height="1" fill="#e6b800" />
        
        {/* Row 22 */}
        <rect x="9" y="21" width="6" height="1" fill="#e6b800" />
      </g>
      
      {/* Number text will be centered in the coin */}
      <text 
        x="12" 
        y="13" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fill="#000000" 
        fontFamily="'Press Start 2P', monospace" 
        fontSize={dimensions.fontSize}
        style={{ 
          fontWeight: 'bold'
        }}
      >
        {number}
      </text>
    </svg>
  );
};

export default CoinSvg;