# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/MultiSend.ts
```

## MULTI SEND TOKEN

 Create recipient.csv file with the following example file
 ***
 Fill in the info in .env file with the following example file
 ***
 Run the following command
```shell
npx hardhat run --network [your-network] scripts/multisend.ts
```
