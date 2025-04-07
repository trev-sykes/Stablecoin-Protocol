import { ethers, EventLog, Log } from "ethers";
import { engine } from "../contracts/bitcoinDollarEngine/index";
import useWeb3Store from "../store/useWeb3Store";

const { jsonRpcProvider } = useWeb3Store.getState();
const contract = new ethers.Contract(engine.address, engine.abi, jsonRpcProvider);

export async function fetchUsersFromEvents() {
    const filterDeposit = contract.filters.CollateralDeposited();
    const filterMint = contract.filters.BitcoinDollarMinted();

    const depositLogs: (Log | EventLog)[] = await contract.queryFilter(filterDeposit, 0, "latest");
    const mintLogs: (Log | EventLog)[] = await contract.queryFilter(filterMint, 0, "latest");

    const allUsers = [
        ...depositLogs.map((log: any) => log.args.user),
        ...mintLogs.map((log: any) => log.args.user),
    ];

    // Remove duplicates
    const uniqueUsers = [...new Set(allUsers.map((addr) => addr.toLowerCase()))];
    console.log("Fetched and deduplicated users:", uniqueUsers); // <- ✅ Add this log
    return uniqueUsers;
}
