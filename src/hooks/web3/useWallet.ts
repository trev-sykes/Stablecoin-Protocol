import { useState } from "react";
import { ethers } from "ethers";
export function useWallet() {
    const [signer, setSigner] = useState<any>(null);
    const [chainId, setChainId] = useState<any>(null);
    const isOnline = (): boolean => {
        return navigator.onLine; // Access the property directly
    };
    const connect = async () => {
        if (!isOnline()) {
            alert("No Internet Connection Found");
            return;
        }
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner(accounts[0]);
        const chainId = await provider.getNetwork().then((network) => network.chainId);

        setSigner(signer);
        setChainId(chainId);
        console.log("Signer successful");
        return { signer, chainId };
    };

    return { signer, connect, chainId };
}