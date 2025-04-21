import { ethers } from "ethers";
import { format } from "date-fns";

const toFormattedDate = (timestamp: number): string => {
    try {
        // Check if timestamp is in seconds (10 digits), convert it to milliseconds (13 digits)
        const timestampMs = timestamp.toString().length === 10
            ? timestamp * 1000
            : timestamp;

        // Create a new Date object using the timestamp
        const date = new Date(timestampMs);

        // Validate if the date object is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date'; // Return 'Invalid Date' if the timestamp is invalid
        }

        // Return the formatted date (e.g., "Mar 6")
        return format(date, "MMM d");
    } catch (error) {
        // Catch any errors and log them to the console
        console.error('Error formatting date:', error);
        return 'Invalid Date'; // Return 'Invalid Date' in case of an error
    }
};
function toPercentageFromFixedPoint(value: bigint): number {
    // The value is assumed to be in 18 decimal precision (fixed-point with 18 decimals)
    const ONE_ETH = 1000000000000000000n; // 10^18

    // Convert to percentage
    const percentage = Number(value * 100n / ONE_ETH);

    return percentage;
}

export const formatDollarsMintedToUSD = (dollars: any) => {
    const dollarsInUSD = parseFloat(ethers.formatUnits(dollars));
    let formatted = "";
    if (dollarsInUSD >= 1_000_000) {
        formatted = `${(dollarsInUSD / 1_000_000).toFixed(1)}M`;
    } else if (dollarsInUSD >= 1_000) {
        formatted = `${(dollarsInUSD / 1_000).toFixed(0)}K`;
    } else {
        formatted = `${dollarsInUSD.toFixed(0)}`;
    }
    return formatted;
}
export const formatTVLToUSD = (oraclePrice: any, totalCollateralDeposited: any) => {
    const precision: any = 100000000n;

    const tvl = (oraclePrice * totalCollateralDeposited) / precision;
    const tvlInUSD = parseFloat(ethers.formatUnits(tvl.toString()));

    let formatted = "";

    if (tvlInUSD >= 1_000_000) {
        formatted = `$${(tvlInUSD / 1_000_000).toFixed(1)}M`;
    } else if (tvlInUSD >= 1_000) {
        formatted = `$${(tvlInUSD / 1_000).toFixed(0)}K`;
    } else {
        formatted = `$${tvlInUSD.toFixed(0)}`;
    }

    return formatted;
};
export const formatter = {
    toFormattedDate,
    toPercentageFromFixedPoint,
    formatTVLToUSD,
    formatDollarsMintedToUSD
}
