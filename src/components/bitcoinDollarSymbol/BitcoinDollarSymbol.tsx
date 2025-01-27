import React from 'react';

type Width = string | number;  // Define the Width type

interface BTCdSymbolProps {
    width: Width;
}

const BTCdSymbol: React.FC<BTCdSymbolProps> = ({ width }) => {
    return (
        <div style={{ width: width }} className="flex items-center gap-2 font-bold">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
                <circle cx="50" cy="50" r="45" fill="#F7931A" stroke="#000000" strokeWidth="2" />
                <path
                    d="M50 15 L50 85 M35 25 L65 25 M35 75 L65 75"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                />
                <text x="73" y="55" fontSize="25" fill="#FFFFFF" fontWeight="bold">
                    d
                </text>
            </svg>
        </div>
    );
};

export default BTCdSymbol;
