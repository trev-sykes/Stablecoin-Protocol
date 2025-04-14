import { ethers } from 'ethers';
import styles from './UserCard.module.css';
import Blockies from 'react-blockies';
import { UserState } from '../../store/useWeb3Store';
import { Card } from '../card/Card';
import { formatter } from '../../utils/handleFormat';
import { X } from "lucide-react";
import HealthFactorBar from '../healthBar/HealthFactorCard';

interface UserCardProps {
    user: UserState | null
    userAddress?: string | null;
    onclose?: any;
}

/**
 * UserCard Component
 *
 * Displays a user's protocol-related portfolio:
 * - User address
 * - sBTC collateral
 * - Collateral USD value
 * - BTCd minted
 * - Debt percentage
 * - Health status
 */
export const UserCard: React.FC<UserCardProps> = ({ userAddress, user, onclose }) => {

    return (
        <div>
            {onclose && (
                <X
                    className={`icon ${styles.x}`}
                    onClick={onclose}
                />
            )}
            <div className="gridContainer">
                {user && (
                    <div className={styles.grid}>
                        {userAddress
                            && (
                                <a
                                    className={styles.userAddressContainer}
                                    href={`https://sepolia.etherscan.io/address/${userAddress}`}
                                    target='_blank'
                                >
                                    <div
                                        className={styles.infoContainer}
                                    >

                                        <Blockies
                                            seed={userAddress}
                                            className={styles.blockie}
                                        />
                                        <span className={styles.address}>0x...{userAddress.slice(userAddress.length - 4, userAddress.length)}</span>
                                    </div>
                                </a>
                            )}
                        <Card>
                            <h3>sBTC Deposited</h3>
                            <p>
                                {
                                    user &&
                                    ethers.formatUnits(user.collateralDeposited).split('.')[0]
                                }
                            </p>
                        </Card>
                        <Card>
                            <h3>Collateral Value (USD)</h3>
                            <p>
                                {
                                    user &&
                                    new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        maximumFractionDigits: 0,
                                    }).format(Number(ethers.formatUnits(user.collateralValueInUsd)))
                                }
                            </p>
                        </Card>
                        <Card>
                            <h3>Total BTCd Minted</h3>
                            <p>
                                {
                                    user &&
                                    ethers.formatUnits(user.totalBitcoinDollarsMinted).split('.')[0]
                                }
                            </p>
                        </Card>
                        <Card>
                            <h3>Debt Share %</h3>
                            <p>
                                {
                                    user &&
                                    formatter.toPercentageFromFixedPoint(user?.userDebtShare || 0n) + '%'
                                }
                            </p>
                        </Card>
                        <Card>
                            <HealthFactorBar
                                healthFactor={user && user.healthFactor}
                            />
                        </Card>
                    </div>
                )
                }
            </div >
        </div>
    )
}