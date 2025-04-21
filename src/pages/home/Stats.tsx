import { Lock } from "lucide-react"
import useWeb3Store from "../../store/useWeb3Store"
import { formatter } from "../../utils/handleFormat";

const { contractState } = useWeb3Store();
const tvl = formatter.formatTVLToUSD(contractState?.oraclePriceInUsd, contractState?.totalWrappedBitcoinCollateralDeposited);
export const stats =
    [
        { title: "TVL", icon: <Lock />, content: `${tvl}` },
    ]
