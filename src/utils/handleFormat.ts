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

const formatTVLToUSD = (oraclePrice: any, totalCollateralDeposited: any) => {
    const precision: any = 100000000n;
    const tvl = ((oraclePrice * totalCollateralDeposited) / precision).toString();
    const formattedTvl = parseFloat(ethers.formatUnits(tvl)).toFixed(2).toString();
    const formattedTvlInUSD = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(Number(formattedTvl));
    return formattedTvlInUSD;
}
export const formatter = {
    toFormattedDate,
    toPercentageFromFixedPoint,
    formatTVLToUSD
}
