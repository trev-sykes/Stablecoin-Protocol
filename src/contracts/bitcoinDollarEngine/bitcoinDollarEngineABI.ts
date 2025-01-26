const bitcoinDollarEngineABI = [{ "type": "constructor", "inputs": [{ "name": "sbtcAddress", "type": "address", "internalType": "address" }, { "name": "bitcoinDollarAddress", "type": "address", "internalType": "address" }, { "name": "btcPriceFeed", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "burnBitcoinDollar", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "burnBitcoinDollarAndRedeemCollateral", "inputs": [{ "name": "collateralAmount", "type": "uint256", "internalType": "uint256" }, { "name": "burnAmount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "canLiquidate", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "depositCollateral", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "depositCollateralAndMintBitcoinDollar", "inputs": [{ "name": "collateralAmount", "type": "uint256", "internalType": "uint256" }, { "name": "mintAmount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "getCollateralRequirementForDebt", "inputs": [{ "name": "debt", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "collateralRequirement", "type": "uint256", "internalType": "uint256" }], "stateMutability": "pure" }, { "type": "function", "name": "getCurrentState", "inputs": [], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct BitcoinDollarEngine.CurrentState", "components": [{ "name": "wBtcPrice", "type": "uint256", "internalType": "uint256" }, { "name": "totalCollateralDeposited", "type": "uint256", "internalType": "uint256" }, { "name": "totalDebt", "type": "uint256", "internalType": "uint256" }, { "name": "collateralizationRatio", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "getCurrentWBTCPrice", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getHealthFactor", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getHealthFactorAfterCollateralChange", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }, { "name": "newCollateralAmount", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getLiquidationParams", "inputs": [], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct BitcoinDollarEngine.LiquidationParams", "components": [{ "name": "liquidationThreshold", "type": "uint256", "internalType": "uint256" }, { "name": "liquidationBonus", "type": "uint256", "internalType": "uint256" }, { "name": "maxLiquidationRatio", "type": "uint256", "internalType": "uint256" }, { "name": "minHealthFactor", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "pure" }, { "type": "function", "name": "getMaxMintableAmount", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "maxMintableAmount", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getSystemCollateralizationRatio", "inputs": [], "outputs": [{ "name": "collateralizationRatio", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getSystemContractAddresses", "inputs": [], "outputs": [{ "name": "sBtcAddress", "type": "address", "internalType": "address" }, { "name": "btcPriceFeedAddress", "type": "address", "internalType": "address" }, { "name": "btcDollarAddress", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "getTotalCollateralDeposited", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getTotalSystemDebt", "inputs": [], "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getUsdValue", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "scaledPrice", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getUserCollateralizationRatio", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "collateralizationRatio", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getUserDebtShare", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "userDebtShare", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getUserInformation", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct BitcoinDollarEngine.UserState", "components": [{ "name": "sBtcOwned", "type": "uint256", "internalType": "uint256" }, { "name": "collateralDeposited", "type": "uint256", "internalType": "uint256" }, { "name": "collateralValueInUsd", "type": "uint256", "internalType": "uint256" }, { "name": "btcDollarMinted", "type": "uint256", "internalType": "uint256" }, { "name": "collateralizationRatio", "type": "uint256", "internalType": "uint256" }, { "name": "healthFactor", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "liquidate", "inputs": [{ "name": "user", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "mintBitcoinDollar", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "redeemCollateral", "inputs": [{ "name": "amount", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "event", "name": "AdditionalSBtcMintedToCoverInsufficientBalance", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amountToMint", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "BitcoinDollarBurned", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "BitcoinDollarMinted", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "CollateralDeposited", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "CollateralRedeemed", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "Liquidated", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "liquidator", "type": "address", "indexed": true, "internalType": "address" }, { "name": "debtRepaid", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "collateralSeized", "type": "uint256", "indexed": false, "internalType": "uint256" }, { "name": "liquidationBonus", "type": "uint256", "indexed": false, "internalType": "uint256" }], "anonymous": false }, { "type": "error", "name": "BitcoinDollarEngine__HealthFactorTooLow", "inputs": [] }, { "type": "error", "name": "BitcoinDollarEngine__InvalidAmount", "inputs": [] }, { "type": "error", "name": "BitcoinDollarEngine__MintFailed", "inputs": [] }, { "type": "error", "name": "BitcoinDollarEngine__MustBurnYourDebtBeforeRedeemingCollateral", "inputs": [{ "name": "debtToBurn", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "BitcoinDollarEngine__NeedsMoreThanZero", "inputs": [] }, { "type": "error", "name": "BitcoinDollarEngine__PositionNotLiquidatable", "inputs": [] }, { "type": "error", "name": "BitcoinDollarEngine__TransferFailed", "inputs": [] }, { "type": "error", "name": "BitcoinDollar__AmountExceedsDebt", "inputs": [{ "name": "debt", "type": "uint256", "internalType": "uint256" }, { "name": "amount", "type": "uint256", "internalType": "uint256" }] }, { "type": "error", "name": "BitcoinDollar__OperationBreaksHealthFactor", "inputs": [] }, { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] }];
export default bitcoinDollarEngineABI;