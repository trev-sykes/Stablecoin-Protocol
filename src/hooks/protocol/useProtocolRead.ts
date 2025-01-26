import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";

import bitcoinDollarEngineABI from "../../contracts/bitcoinDollarEngine/bitcoinDollarEngineABI";
import bitcoinDollarEngineAddress from "../../contracts/bitcoinDollarEngine/bitcoinDollarEngineAddress";

export function useProtocolRead() {
    const rpcUrl = import.meta.env.VITE_INFURA_RPC_URL;

    if (!rpcUrl) {
        throw new Error('RPC URL not configured. Please check your environment variables.');
    }
    console.log('rpc url', rpcUrl);

    const [protocolState, setProtocolState] = useState({
        bitcoinPrice: null,
        sBtcDeposits: null,
        liquidity: null,
        debt: null,
        protocolHealthFactor: null,
        protocolAddresses: null,
        isLoadingProtocolState: true,
        errorProtocolState: null
    });
    const protcolStateRef = useRef(false);
    const refreshProtocolState = useCallback(async () => {
        if (protcolStateRef.current) return;
        protcolStateRef.current = true;
        try {
            // Correctly initialize provider for Sepolia
            const provider = new ethers.JsonRpcProvider(rpcUrl, {
                name: 'sepolia',
                chainId: 11155111
            });
            // await is needed
            await provider.ready;

            const contractInstance = new ethers.Contract(
                bitcoinDollarEngineAddress,
                bitcoinDollarEngineABI,
                provider
            );

            const [protocolInfoResponse, protocolAddressesResponse] = await Promise.all([
                contractInstance.getCurrentState(),
                contractInstance.getSystemContractAddresses()
            ]);

            const liquidityResponse = await contractInstance.getUsdValue(protocolInfoResponse[1]);

            setProtocolState({
                bitcoinPrice: protocolInfoResponse[0],
                sBtcDeposits: protocolInfoResponse[1],
                liquidity: liquidityResponse,
                debt: protocolInfoResponse[2],
                protocolHealthFactor: protocolInfoResponse[3],
                protocolAddresses: protocolAddressesResponse,
                isLoadingProtocolState: false,
                errorProtocolState: null
            });
        } catch (err: any) {
            console.error('Error refreshing protocol state:', err);
            setProtocolState(prev => ({
                ...prev,
                isLoadingProtocolState: false,
                errorProtocolState: err.message
            }));
        }
    }, [rpcUrl]);

    useEffect(() => {
        refreshProtocolState();
    }, [refreshProtocolState]);

    return { ...protocolState, refreshProtocolState };
}