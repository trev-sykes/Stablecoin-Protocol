// src/contracts/ERC20/index.ts
import { ethers } from 'ethers';
import bitcoinDollarABI from './bitcoinDollarEngineABI';
import bitcoinDollarAddress from './bitcoinDollarEngineAddress';

export const getBitcoinDollarEngineContract = (provider: any, signer?: any) => {
    const contract = new ethers.Contract(bitcoinDollarAddress, bitcoinDollarABI, provider);
    if (signer) {
        return contract.connect(signer);
    }
    return contract;
};