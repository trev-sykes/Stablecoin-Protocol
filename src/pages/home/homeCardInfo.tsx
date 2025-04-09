import { Bitcoin, DollarSign, Shield, Activity, Lock, TrendingUp, Gem } from 'lucide-react';

/**
 * Core features displayed on the home page.
 * Each object includes an icon, title, and short description.
 */
export const homeCardInfo = [
    {
        icon: <Bitcoin />,
        title: "BTC Collateral",
        description: "Use wrapped Bitcoin as collateral to mint stable USD tokens"
    },
    {
        icon: <DollarSign />,
        title: "Dollar Stability",
        description: "Keep a 1:1 USD peg with overcollateralization"
    },
    {
        icon: <Shield />,
        title: "Secure Design",
        description: "Thoroughly tested smart contracts for top-tier security"
    },
    {
        icon: <Activity />,
        title: "Real-time Monitoring",
        description: "Monitor position health and market conditions live"
    },
    {
        icon: <Lock />,
        title: "Liquidation Protection",
        description: "Maintain 150% collateral to prevent liquidation"
    },
    {
        icon: <TrendingUp />,
        title: "Liquidation Threshold",
        description: "Liquidators can seize up to 50% if below threshold"
    },
    {
        icon: <Gem />,
        title: "Liquidation Bonus",
        description: "Earn a 10% bonus for liquidating underperforming positions"
    }
];
