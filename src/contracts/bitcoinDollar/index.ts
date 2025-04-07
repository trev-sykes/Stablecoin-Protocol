import bitcoinDollarABI from './bitcoinDollarABI';  // The ABI of the ERC20 contract
import bitcoinDollarAddress from './bitcoinDollarAddress'; // Address of the deployed ERC20 contract
import { ContractDetails } from '../contractInterface';
export const bitcoinDollar: ContractDetails = {
    address: bitcoinDollarAddress,
    abi: bitcoinDollarABI
}