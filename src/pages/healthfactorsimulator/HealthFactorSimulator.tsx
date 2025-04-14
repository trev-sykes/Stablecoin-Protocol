import { useState } from 'react';
import styles from './HealthFactorSimulator.module.css';
import { ethers } from 'ethers';
// import { BitcoinDollarEngine__factory } from '../typechain-types'; // Adjust path as needed

type Props = {
    contractAddress?: string;
    userAddress?: string;
    provider?: ethers.Provider;
};

const HealthFactorSimulator = ({ contractAddress, userAddress, provider }: Props) => {
    const [amountToMint, setAmountToMint] = useState('');
    const [newHealthFactor, setNewHealthFactor] = useState<string | null>(null);
    const [requiredCollateral, setRequiredCollateral] = useState<string | null>(null);
    const [maxMintable, setMaxMintable] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // const contract = BitcoinDollarEngine__factory.connect(contractAddress, provider);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmountToMint(e.target.value);
    };

    // const simulate = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!amountToMint || isNaN(+amountToMint)) {
    //         setError('Please enter a valid number');
    //         return;
    //     }

    //     setError(null);
    //     setLoading(true);

    //     try {
    //         const mintAmount = ethers.utils.parseEther(amountToMint);

    //         const [healthFactor, collateralRequired, maxMint] = await Promise.all([
    //             contract.getHealthFactorAfterMint(userAddress, mintAmount),
    //             contract.getCollateralRequirementForDebt(mintAmount),
    //             contract.getMaxMintableAmount(userAddress),
    //         ]);

    //         setNewHealthFactor(ethers.utils.formatEther(healthFactor));
    //         setRequiredCollateral(ethers.utils.formatEther(collateralRequired));
    //         setMaxMintable(ethers.utils.formatEther(maxMint));
    //     } catch (err: any) {
    //         setError(err.message || 'Error simulating values');
    //     }

    //     setLoading(false);
    // };

    return (
        <div className={styles.popupContainer}>
            <form className={styles.form}>
                <h2 className={styles.title}>Simulate Mint</h2>

                <label className={styles.label}>
                    Amount to Mint (BTC-Dollar)
                    <input
                        className={styles.input}
                        type="number"
                        value={amountToMint}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        min="0"
                        step="0.01"
                    />
                </label>

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Simulating...' : 'Calculate'}
                </button>

                {error && <p className={styles.error}>{error}</p>}

                {newHealthFactor && (
                    <div className={styles.results}>
                        <p><strong>New Health Factor:</strong> {newHealthFactor}</p>
                        <p><strong>Required Collateral:</strong> {requiredCollateral} sBTC</p>
                        <p><strong>Max Mintable:</strong> {maxMintable} BTC-Dollar</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default HealthFactorSimulator;
