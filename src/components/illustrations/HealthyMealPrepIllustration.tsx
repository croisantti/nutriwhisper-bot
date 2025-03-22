
import React from "react";

const HealthyMealPrepIllustration: React.FC = () => {
  return (
    <svg
      className="w-full h-auto max-w-md mx-auto"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Table */}
        <path d="M120 620L680 620" stroke="#2D283E" strokeWidth="3" />
        <rect x="120" y="500" width="560" height="120" rx="10" stroke="#2D283E" strokeWidth="3" fill="none" />
        
        {/* Plant */}
        <path d="M620 280C620 280 660 300 680 340" stroke="#f0f0f0" strokeWidth="6" strokeLinecap="round" />
        <path d="M620 280C620 280 640 320 620 360" stroke="#f0f0f0" strokeWidth="6" strokeLinecap="round" />
        <path d="M620 280C620 280 600 320 560 340" stroke="#f0f0f0" strokeWidth="6" strokeLinecap="round" />
        <path d="M620 280C620 280 580 300 560 260" stroke="#f0f0f0" strokeWidth="6" strokeLinecap="round" />
        <rect x="600" y="360" width="40" height="60" rx="10" fill="#f0f0f0" />
        
        {/* Food plate */}
        <circle cx="280" cy="540" r="60" fill="#2D283E" />
        <path d="M240 540C240 540 260 520 280 540" stroke="#E2725B" strokeWidth="12" strokeLinecap="round" />
        <path d="M280 540C280 540 300 520 320 540" stroke="#E2725B" strokeWidth="12" strokeLinecap="round" />
        <path d="M260 520C260 520 280 500 300 520" stroke="#E2725B" strokeWidth="12" strokeLinecap="round" />
        
        {/* Documents/placemats */}
        <rect x="380" y="520" width="80" height="40" rx="4" fill="#f0f0f0" />
        <rect x="480" y="520" width="80" height="40" rx="4" fill="#f0f0f0" />
        <rect x="580" y="520" width="40" height="40" rx="4" fill="#f0f0f0" />
        
        {/* Person */}
        <circle cx="280" cy="220" r="60" fill="#FFB6B6" />
        <path d="M280 280C280 280 340 300 380 380" stroke="#E2725B" strokeWidth="100" strokeLinecap="round" />
        <path d="M380 380C380 380 400 420 360 460" stroke="#2D283E" strokeWidth="30" strokeLinecap="round" />
        <path d="M260 460C260 460 280 380 340 400" stroke="#E2725B" strokeWidth="40" strokeLinecap="round" />
        <path d="M340 400C340 400 380 400 420 420" stroke="#FFB6B6" strokeWidth="30" strokeLinecap="round" />
        <path d="M280 160C280 160 300 120 320 160" stroke="#2D283E" strokeWidth="60" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default HealthyMealPrepIllustration;
