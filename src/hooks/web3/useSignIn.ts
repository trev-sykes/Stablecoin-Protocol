import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useWallet } from "./useWallet";
import bitcoinDollarEngineAddress from "../../contracts/bitcoinDollarEngine/bitcoinDollarEngineAddress";
import bitcoinDollarEngineABI from "../../contracts/bitcoinDollarEngine/bitcoinDollarEngineABI";
export function useSignIn() {

    const { chainId } = useWallet();
    const [isSignInLoadingState, setIsSignInLoadingState] = useState(true);
    const [userState, setUserState] = useState({
        userDeposits: null,
        userDepositValue: null,
        userMintedDollars: null,
        userDebtSharePercentage: null,
        userHealthFactor: null,
        userMaxMintableAmount: null,
        signer: ethers.JsonRpcSigner.prototype
    });
    const refreshOrConnectUserData = useCallback(async () => {

        setIsSignInLoadingState(true);
        try {
            // Get  the signer and wait for it
            if (!window.ethereum) return;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner(accounts[0]);


            const contractInstance = new ethers.Contract(
                bitcoinDollarEngineAddress,
                bitcoinDollarEngineABI,
                signer
            );
            const [userInfoResponse, debtShareResponse, maxMintableAmountResponse] = await Promise.all([
                contractInstance.getUserInformation(signer.address), // Use signer.address instead of signer
                contractInstance.getUserDebtShare(signer.address),
                contractInstance.getMaxMintableAmount(signer.address)
            ]);
            console.log(maxMintableAmountResponse);
            setUserState({
                userDeposits: userInfoResponse[1],
                userDepositValue: userInfoResponse[2],
                userMintedDollars: userInfoResponse[3],
                userDebtSharePercentage: debtShareResponse,
                userHealthFactor: userInfoResponse[5],
                userMaxMintableAmount: maxMintableAmountResponse,
                signer: signer
            });
            setIsSignInLoadingState(false);
        } catch (err) {
            console.log(err);
            setUserState({ ...userState });
            setIsSignInLoadingState(true);
        }
    }, []);

    return { ...userState, isSignInLoadingState, refreshOrConnectUserData, chainId }
};