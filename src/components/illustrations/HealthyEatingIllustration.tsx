
import React from "react";

const HealthyEatingIllustration: React.FC = () => {
  return (
    <svg
      className="w-full h-auto max-w-md mx-auto"
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Person on left drinking */}
        <path d="M254 124C254 124 248 164 248 204C248 244 254 324 254 324" stroke="#f0f0f0" strokeWidth="80" strokeLinecap="round" />
        <path d="M254 534C254 534 254 494 254 454C254 414 254 404 254 404" stroke="#2D283E" strokeWidth="80" strokeLinecap="round" />
        <circle cx="254" cy="164" r="40" fill="#FFB6B6" />
        <path d="M254 204C254 204 294 214 294 254" stroke="#f0f0f0" strokeWidth="20" strokeLinecap="round" />
        <path d="M294 254C294 254 324 234 344 254" stroke="#E2725B" strokeWidth="30" strokeLinecap="round" />
        <path d="M344 254C344 254 354 224 374 224" stroke="#2D283E" strokeWidth="10" strokeLinecap="round" />
        <path d="M214 204C214 204 194 224 194 244" stroke="#f0f0f0" strokeWidth="20" strokeLinecap="round" />
        <path d="M194 244C194 244 174 244 154 234" stroke="#f0f0f0" strokeWidth="10" strokeLinecap="round" />
        <path d="M234 134C234 134 254 104 274 134" stroke="#2D283E" strokeWidth="30" strokeLinecap="round" />

        {/* Person on right drinking */}
        <path d="M554 124C554 124 548 164 548 204C548 244 554 324 554 324" stroke="#f0f0f0" strokeWidth="80" strokeLinecap="round" />
        <path d="M554 534C554 534 554 494 554 454C554 414 554 404 554 404" stroke="#2D283E" strokeWidth="80" strokeLinecap="round" />
        <circle cx="554" cy="164" r="40" fill="#C07F7F" />
        <path d="M554 204C554 204 594 214 594 254" stroke="#f0f0f0" strokeWidth="20" strokeLinecap="round" />
        <path d="M594 254C594 254 624 234 644 254" stroke="#E2725B" strokeWidth="30" strokeLinecap="round" />
        <path d="M644 254C644 254 654 224 674 224" stroke="#2D283E" strokeWidth="10" strokeLinecap="round" />
        <path d="M514 204C514 204 494 224 494 244" stroke="#f0f0f0" strokeWidth="20" strokeLinecap="round" />
        <path d="M534 354C534 354 514 334 524 314" stroke="#C07F7F" strokeWidth="20" strokeLinecap="round" />
        <path d="M534 134C534 134 554 94 574 134" stroke="#2D283E" strokeWidth="30" strokeLinecap="round" />
        
        {/* Ground line */}
        <path d="M100 574H700" stroke="#2D283E" strokeWidth="2" />
        
        {/* Decorative plants */}
        <path d="M174 544C174 544 154 524 174 504" stroke="#f0f0f0" strokeWidth="4" strokeLinecap="round" />
        <path d="M164 534C164 534 144 534 144 514" stroke="#f0f0f0" strokeWidth="4" strokeLinecap="round" />
        <path d="M674 544C674 544 654 524 674 504" stroke="#f0f0f0" strokeWidth="4" strokeLinecap="round" />
        <path d="M664 534C664 534 644 534 644 514" stroke="#f0f0f0" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default HealthyEatingIllustration;
