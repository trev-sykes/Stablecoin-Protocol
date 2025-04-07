// src/contracts/ERC20/index.ts
import bitcoinDollarABI from './bitcoinDollarEngineABI';
import bitcoinDollarAddress from './bitcoinDollarEngineAddress';
import { ContractDetails } from '../contractInterface';
export const engine: ContractDetails = {
    address: bitcoinDollarAddress,
    abi: bitcoinDollarABI
}