import styles from './Hero.module.css';
interface HeroProps {
    children: React.ReactNode; // Content to be rendered inside the Hero component
}

/**
 * Hero component that wraps its children in a div with the 'hero' class.
 */
export const Hero: React.FC<HeroProps> = ({ children }) => {
    return (
        <div className={styles.hero}>
            {children}
        </div>
    );
};
