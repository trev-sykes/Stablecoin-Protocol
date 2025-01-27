import { ethers } from "ethers";
import bitcoinDollarEngineABI from "../../contracts/bitcoinDollarEngine/bitcoinDollarEngineABI";
import bitcoinDollarEngineAddress from "../../contracts/bitcoinDollarEngine/bitcoinDollarEngineAddress";
import syntheticBitcoinAddress from "../../contracts/syntheticBitcoin/syntheticBitcoinAddress";
import syntheticBitcoinABI from "../../contracts/syntheticBitcoin/synthetiBitcoinABI";
import bitcoinDollarAddress from "../../contracts/bitcoinDollar/bitcoinDollarAddress";
import bitcoinDollarABI from "../../contracts/bitcoinDollar/bitcoinDollarABI";

export function useProtocolWrite() {
    // Check allowance and approve if necessary
    const handleApproveSyntheticBtc = async (amount: string) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(syntheticBitcoinAddress, syntheticBitcoinABI, signer);

            // Convert amount to the appropriate units
            const approvalAmount = ethers.parseUnits(amount, 'ether');

            // Check the current allowance
            const currentAllowance = await contractInstance.allowance(accounts[0], bitcoinDollarEngineAddress);

            // If the current allowance is less than the required amount, approve the spender
            if (currentAllowance < (approvalAmount)) {
                await contractInstance.approve(bitcoinDollarEngineAddress, ethers.MaxUint256 - 2n); // approve max
                return true;
            }

            console.log("Sufficient allowance already granted.");
            return true; // No need to approve again if allowance is sufficient

        } catch (err) {
            console.error('Approval failed:', err);
            return false;
        }
    };
    const handleApproveBtcDollars = async (amount: string) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(bitcoinDollarAddress, bitcoinDollarABI, signer);

            // Convert amount to the appropriate units
            const approvalAmount = ethers.parseUnits(amount, 'ether');

            // Check the current allowance
            const currentAllowance = await contractInstance.allowance(accounts[0], bitcoinDollarEngineAddress);

            // If the current allowance is less than the required amount, approve the spender
            if (currentAllowance < (approvalAmount)) {
                await contractInstance.approve(bitcoinDollarEngineAddress, ethers.MaxUint256 - 2n); // approve max
                return true;
            }

            console.log("Sufficient allowance already granted.");
            return true; // No need to approve again if allowance is sufficient

        } catch (err) {
            console.error('Approval failed:', err);
            return false;
        }
    };
    const handleDeposit = async (amount: string) => {

        try {
            await handleApproveSyntheticBtc(amount);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(bitcoinDollarEngineAddress, bitcoinDollarEngineABI, signer);
            const txAmount = ethers.parseUnits(amount, 'ether');
            return await contractInstance.depositCollateral(txAmount);


        } catch (err) {
            console.log(err);
        }
    };
    const handleWithdraw = async (amount: any) => {
        if (!window.ethereum) {
            console.log("No Web3 provider found");
            return;
        }
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requrestAccounts", []);
            if (accounts.length < 1) {
                console.log("Accounts Request unsuccessful.");
                return;
            }
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(bitcoinDollarEngineAddress, bitcoinDollarEngineABI, signer);
            const txAmount = ethers.parseUnits(amount, 'ether');
            return await contractInstance.withdraw(txAmount);

        } catch (err: any) {
            console.error('Error processing your withdraw', err.message);
        }
    }
    const handleMinting = async (amount: any) => {

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(bitcoinDollarEngineAddress, bitcoinDollarEngineABI, signer);
            const txAmount = ethers.parseUnits(amount, 'ether');
            return await contractInstance.mintBitcoinDollar(txAmount);
        } catch (err) {
            console.log(err)
        }
    };
    const handleBurning = async (amount: any) => {

        try {
            await handleApproveBtcDollars(amount);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner(accounts[0]);
            const contractInstance = new ethers.Contract(bitcoinDollarEngineAddress, bitcoinDollarEngineABI, signer);
            const txAmount = ethers.parseUnits(amount, 'ether');
            return await contractInstance.burnBitcoinDollar(txAmount);
        } catch (err) {
            console.log(err)
        }
    };
    return { handleDeposit, handleMinting, handleWithdraw, handleBurning };
}
