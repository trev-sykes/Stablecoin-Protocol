import React from 'react';
import styles from "./ConditionalLink.module.css";
import { Link, LinkProps, useLocation } from 'react-router-dom';

interface ConditionalLinkProps extends LinkProps {
    to: string;
    children: React.ReactNode;
    disabled: boolean;
}
/**
 * A link component that conditionally disables the link based on the `disabled` prop.
 */
const ConditionalLink: React.FC<ConditionalLinkProps> = ({ to, children, disabled }) => {

    /**
     * Retrieves the current location from the router to determine if the link is active.
     */
    const location = useLocation();
    const pathname = location.pathname;
    const active = pathname == to;

    /**
       * Prevents the default link action if the link is disabled.
       */
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (disabled) {
            event.preventDefault();
        }
    };

    return (
        <Link
            to={to}
            onClick={handleClick}
            className={`${styles.link} ${disabled ? "disabled" : ""}`}
        >
            <div className={`${styles.menuItemContainer} ${active ? styles.active : ""}`}>
                {children}
            </div>
        </Link>

    );
};

export default ConditionalLink;
