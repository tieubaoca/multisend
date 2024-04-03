import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  defaultNetwork: 'hardhat',
  networks: {
    local: {
      url: 'http://localhost:8545',
      accounts: [process.env.LOCAL_PRIVATE_KEY!],
    },
    bscTestnet: {
      url: 'https://endpoints.omniatech.io/v1/bsc/testnet/public',
      accounts: [process.env.BSC_TESTNET_PRIVATE_KEY!],
      gasPrice: 5000000000,
    },
    bscMainnet: {
      url: 'https://bsc-dataseed1.binance.org/',
      accounts: [process.env.BSC_MAINNET_PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};

export default config;
