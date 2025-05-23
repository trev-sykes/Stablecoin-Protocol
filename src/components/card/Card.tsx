// Card.tsx 
import React from "react";
import styles from "./card.module.css";

type CardProps = {
    className?: string;
    children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ className = "", children }) => {
    return <div className={`${styles.card} ${className}`}>{children}</div>;
};
