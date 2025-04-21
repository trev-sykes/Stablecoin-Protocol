import { GemIcon, DollarSign, Activity } from 'lucide-react';

/**
 * Core features displayed on the home page.
 * Each object includes an icon, title, and short description.
 */
export const liquidationInfo = [
    {
        icon: < GemIcon size={50} />,
        title: "10% Bonus",
        description: "Liquidate bad positions and receive a ten percent bonus!"
    },
    {
        icon: <DollarSign size={50} />,
        title: "150% over-collateralized",
        description: "To keep your position healthy, you must maintain a 150% ratio"
    },
    {
        icon: <Activity size={50} />,
        title: "Position Monitoring",
        description: "Track your collateral health with real-time market data"
    },
];