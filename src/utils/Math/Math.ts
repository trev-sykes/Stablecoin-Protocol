const toPercentageCollateralizationRatio = (ratio: bigint): number => {
    const scaledCR = (Number(ratio) / 1e18) * 100;
    // Return the scaled value directly without clamping to 100 since CR can be much higher
    return scaledCR;
};
const toPercentageHealthFactor = (healthFactor: bigint): number => {
    // Convert the health factor to a percentage
    const scaledHealthFactor = Number(healthFactor) / 1e16;  // Dividing by 1e16 to reflect actual percentage

    // Ensure the scale is between 0 and 100
    return Math.max(scaledHealthFactor, 0);  // We no longer cap it at 100 since you're showing real percentage
};
function toPercentageFromFixedPoint(value: bigint): number {
    // The value is assumed to be in 18 decimal precision (fixed-point with 18 decimals)
    const ONE_ETH = 1000000000000000000n; // 10^18

    // Convert to percentage
    const percentage = Number(value * 100n / ONE_ETH);

    return percentage;
}

export const math = {
    toPercentageCollateralizationRatio,
    toPercentageHealthFactor,
    toPercentageFromFixedPoint
}