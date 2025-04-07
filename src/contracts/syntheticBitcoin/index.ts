import syntheticBitcoinABI from './synthetiBitcoinABI';
import syntheticBitcoinAddress from './syntheticBitcoinAddress';
import { ContractDetails } from "../contractInterface";
export const syntheticBitcoin: ContractDetails = {
    address: syntheticBitcoinAddress,
    abi: syntheticBitcoinABI
}
