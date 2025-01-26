// src/contracts/ERC20/index.ts
import { ethers } from 'ethers';
import syntheticBitcoinABI from './synthetiBitcoinABI';
import syntheticBitcoinAddress from './syntheticBitcoinAddress';

export const getSyntheticBitcoinContract = (provider: any, signer?: any) => {
    const contract = new ethers.Contract(syntheticBitcoinAddress, syntheticBitcoinABI, provider);
    if (signer) {
        return contract.connect(signer);
    }
    return contract;
};