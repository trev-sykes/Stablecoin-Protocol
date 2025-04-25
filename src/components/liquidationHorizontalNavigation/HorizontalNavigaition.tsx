import { AnimatePresence, motion } from "framer-motion"
import styles from "./HorizontalNavigation.module.css";
import { Droplet, DropletOff, History } from "lucide-react";
interface HorizontalNavigaitionProps {
    activeSection: any;
    handleSectionSelect: any;
}
export const HorizontalNavigation: React.FC<HorizontalNavigaitionProps> = ({ activeSection, handleSectionSelect }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="non-liquidatable-users"
                className={styles.container}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.navigation}>
                    <div
                        className={`${styles.item} ${activeSection == 'liquidatable' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('liquidatable')}
                    >
                        <Droplet className="icon" />
                        <p>Liquidatable Users</p>
                    </div>
                    <div
                        className={`${styles.item} ${activeSection == 'non-liquidatable' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('non-liquidatable')}
                    >
                        <DropletOff className="icon" />
                        <p>Non-Liquidatable Users</p>

                    </div>
                    <div
                        className={`${styles.item} ${activeSection == 'past-liquidations' ? styles.active : ''}`}
                        onClick={() => handleSectionSelect('past-liquidations')}
                    >
                        <History className="icon" />
                        <p>Past Liquidations</p>
                    </div>

                </div>

            </motion.div>
        </AnimatePresence>
    )
}