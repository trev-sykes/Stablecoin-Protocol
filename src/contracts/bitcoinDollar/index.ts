// src/contracts/ERC20/index.ts
import { ethers } from 'ethers';
import bitcoinDollarABI from './bitcoinDollarABI';  // The ABI of the ERC20 contract
import bitcoinDollarAddress from './bitcoinDollarAddress'; // Address of the deployed ERC20 contract

export const getBitcoinDollarContract = (provider: any, signer?: any) => {
    const contract = new ethers.Contract(bitcoinDollarAddress, bitcoinDollarABI, provider);
    if (signer) {
        return contract.connect(signer);
    }
    return contract;
};