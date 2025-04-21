import React from 'react';
import logo from "../../../public/logo.png"

/**
 * Type for defining the width property (either string or number).
 */
type Width = string | number;

interface BTCdSymbolProps {
    /** Width of the symbol component. */
    width: Width;
}

/**
 * Displays the BTCd symbol with a customizable width.
 */
const BTCdSymbol: React.FC<BTCdSymbolProps> = ({ width }) => {
    return (
        <img src={logo} alt="logo" style={{ width: width }} />
    );
};

export default BTCdSymbol;
