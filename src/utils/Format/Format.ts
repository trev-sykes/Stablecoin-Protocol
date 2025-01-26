import { math } from "../Math/Math";
import { ethers } from "ethers";
import { format } from "date-fns";

const toFormattedCollateralizationRatioColor = (collateralizationRatio: bigint): any => {
    const scaledCR = math.toPercentageCollateralizationRatio(collateralizationRatio)

    // Define color thresholds for collateralization ratio
    if (scaledCR >= 150) {
        return 'success'; // Green if 150% and above (healthy)
    } else if (scaledCR >= 120) {
        return 'warning'; // Yellow if between 120% and 149% (caution)
    } else {
        return 'error'; // Red if below 120% (risky)
    }
};
const toFormattedHealthBarColor = (healthFactor: bigint): any => {
    console.log(`Health factor: ${healthFactor}`);
    const scaledHealthFactor = math.toPercentageHealthFactor(healthFactor);

    // Define color thresholds
    if (scaledHealthFactor >= 145) {
        console.log(`Scaled health factor: ${scaledHealthFactor}`);
        return 'success';
    } else if (scaledHealthFactor >= 125) {
        console.log(`Scaled health factor: ${scaledHealthFactor}`);
        return 'warning';
    } else {
        console.log(`Scaled health factor: ${scaledHealthFactor}`);
        return 'error'; // Red if below 100% (liquidation risk)
    }
};
const toFormattedBitcoinPrice = (price: any) => {
    const bitIntScaleFactor = 100000000n;
    return (price / bitIntScaleFactor).toLocaleString();
};
const toFormattedLiquidity = (price: any) => {
    const bigIntScale = 1000000000000000000n;
    return (price / bigIntScale);
}
const toFormattedData = (title: string, data: any): Function => {
    let newData = data;
    switch (title) {
        case 'Bitcoin Price':
            newData = toFormattedBitcoinPrice(data ? data : 0n);
            break;
        case 'Deposits':
            newData =
                ethers.formatUnits(newData);
            break;
        case 'Liquidity':
            newData = toFormattedLiquidity(data);
            break;
        case 'Debt':
            newData = ethers.formatUnits(data);
            break;
        default:
            newData = 0;
            break;
    }
    return newData;
}

const toFormattedDate = (timestamp: number): string => {
    try {
        // Check if timestamp is in milliseconds (13 digits) or seconds (10 digits)
        const timestampMs = timestamp.toString().length === 10
            ? timestamp * 1000
            : timestamp;

        // Validate the timestamp is within reasonable bounds
        const date = new Date(timestampMs);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        return format(date, "MMM d");
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
};

const toFormattedCurrency = (value: number | bigint): string => {
    return typeof value === 'bigint'
        ? value.toString()
        : new Intl.NumberFormat('en-US').format(Math.floor(value));
};
export const displays = {
    toFormattedBitcoinPrice,
    toFormattedLiquidity,
    toFormattedData,
    toFormattedCollateralizationRatioColor,
    toFormattedHealthBarColor,
    toFormattedDate,
    toFormattedCurrency
}