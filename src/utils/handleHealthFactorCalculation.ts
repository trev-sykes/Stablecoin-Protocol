export type HealthStatus = {
    status: string;
    color: string;
};

const HEALTHY_THRESHOLD: any = 1.5 * 1e18; // Healthy if above 1.5e18
const WARNING_THRESHOLD: any = 1.0 * 1e18; // Needs work if above 1.0e18
const CRITICAL_THRESHOLD: any = 0.5 * 1e18; // Bad if above 0.5e18
const MIN_HEALTH: any = 1e18; // Minimum health is 1e18 (1x10^18)

const MAX_UINT256 = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); // 2^256 - 1

/**
 * Returns the health status based on the given health factor (from Solidity).
 * 
 * @param healthFactor The health factor to evaluate (should be in uint256 format, e.g., 1e18 scale).
 * @returns A HealthStatus object with status and color information.
 */
export const handleHealthFactorCalculation = (healthFactor: BigInt): HealthStatus => {
    // Handle the case where the protocol has max health
    if (healthFactor === MAX_UINT256) {
        return { status: "Very Healthy", color: "gray" };
    }

    // Handle cases with a health factor below the minimum threshold
    if (healthFactor < MIN_HEALTH) {
        return { status: "Position Risks Liquidation", color: "darkred" };
    }

    // Apply the thresholds to determine the health status
    if (healthFactor > HEALTHY_THRESHOLD) {
        return { status: "Healthy", color: "green" };
    } else if (healthFactor > WARNING_THRESHOLD) {
        return { status: "Needs Work", color: "yellow" };
    } else if (healthFactor > CRITICAL_THRESHOLD) {
        return { status: "Bad", color: "red" };
    } else {
        return { status: "Position Risks Liquidation", color: "darkred" };
    }
};
