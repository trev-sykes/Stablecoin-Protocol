import { AnimatePresence, motion } from "framer-motion"
import styles from "./HorizontalNavigation.module.css";
import { ArrowDownCircle, ArrowUpCircle, Flame, PlusCircle, Zap } from "lucide-react";
interface HorizontalNavigaitionProps {
    activeSection: any;
    handleSectionSelect: any;
}
export const HorizontalNavigation: React.FC<HorizontalNavigaitionProps> = ({ activeSection, handleSectionSelect }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="collateral"
                className={styles.container}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.navigation}>
                    <div
                        className={`${styles.item} ${activeSection == 'deposit' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('deposit')}
                    >
                        <ArrowDownCircle className="icon" />
                        <p>Deposit</p>
                    </div>
                    <div
                        className={`${styles.item} ${activeSection == 'withdraw' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('withdraw')}
                    >
                        <ArrowUpCircle className="icon" />
                        <p>Withdraw</p>

                    </div>
                    <div
                        className={`${styles.item} ${activeSection == 'mint' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('mint')}
                    >
                        <PlusCircle className="icon" />
                        <p>Mint</p>
                    </div>
                    <div
                        className={`${styles.item} ${activeSection == 'burn' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('burn')}
                    >
                        <Flame className="icon" />
                        <p>Burn</p>
                    </div>
                    <div
                        className={`${styles.item} ${activeSection == 'easy-mint' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('easy-mint')}
                    >
                        <Zap className="icon" />
                        <p>Easy Mint</p>
                    </div>

                </div>

            </motion.div>
        </AnimatePresence>
    )
}