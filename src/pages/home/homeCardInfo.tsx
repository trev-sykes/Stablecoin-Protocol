import { Bitcoin, DollarSign, Shield, Activity, GitFork } from 'lucide-react';

/**
 * Core features displayed on the home page.
 * Each object includes an icon, title, and short description.
 */
export const homeCardInfo = [
    {
        icon: <Bitcoin />,
        title: "BTC Collateral",
        description: "Deposit wrapped Bitcoin as collateral to mint stable USD tokens"
    },
    {
        icon: <DollarSign />,
        title: "Dollar Stability",
        description: "Maintain 1:1 USD peg through overcollateralization"
    },
    {
        icon: <Shield />,
        title: "Secure Design",
        description: "Built with battle-tested security features and guards"
    },
    {
        icon: <Activity />,
        title: "Real-time Monitoring",
        description: "Track position health and market conditions"
    },
    {
        icon: <GitFork />,
        title: "Liquidation Protection",
        description: "Maintain 150% collateral ratio to avoid liquidation"
    }
];