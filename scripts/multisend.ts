import { ethers } from 'hardhat';
import { info, error } from './log';
import fs from 'fs';
import csv from 'csv-parser';

const minAmount = ethers.parseEther(process.env.MIN_AMOUNT!);
const maxAmount = ethers.parseEther(process.env.MAX_AMOUNT!);
const numOfAddresses = parseInt(process.env.NUM_OF_ADDRESSES!);

async function main() {
  const multiSend = await ethers.getContractAt(
    'MultiSend',
    process.env.MULTISEND_ADDRESS!
  );
  const addresses: string[] = [];
  const amounts: bigint[] = [];

  const stream = fs.createReadStream('./recipients.csv', { encoding: 'utf8' });
  let value = BigInt(0);

  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (data) => {
        const address = data['Address'];
        if (!ethers.isAddress(address)) {
          error(`Invalid address: ${address}}`);
          return;
        }
        addresses.push(data['Address']);
        const rnd = ethers.parseEther(Math.random().toString());
        const amount =
          minAmount + (rnd * (maxAmount - minAmount)) / ethers.WeiPerEther;
        amounts.push(amount);
      })
      .on('end', resolve)
      .on('error', reject);
  });

  for (let i = 0; i * numOfAddresses < addresses.length; i++) {
    const lastIdx = Math.min((i + 1) * numOfAddresses, addresses.length);
    info(`${i}=====================================${lastIdx}`);
    info(
      `Processing address from index ${i * numOfAddresses} to ${lastIdx}...`
    );
    const chunkAddresses = addresses.slice(i * numOfAddresses, lastIdx);
    const chunkAmounts = amounts.slice(i * numOfAddresses, lastIdx);
    value = chunkAmounts.reduce((acc, amount) => acc + amount, BigInt(0));
    info(`Total value: ${ethers.formatEther(value)} BNB`);
    const tx = await multiSend.multiSend(chunkAddresses, chunkAmounts, {
      value: value,
    });
    info(
      `MultiSend ${ethers.formatEther(value)} BNB to ${
        addresses.length
      } addresses, index from ${i * numOfAddresses} to ${lastIdx} tx: ${
        tx.hash
      }`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
