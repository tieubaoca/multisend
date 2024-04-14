import { ethers } from 'hardhat';
import { MultiSend, TestERC20 } from '../typechain-types';
import { Signer } from 'ethers';
import { expect } from 'chai';

describe('MultiSend', () => {
  let multiSend: MultiSend;
  let token: TestERC20;
  let deployer: Signer, user1: Signer, user2: Signer, user3: Signer;
  let nativeAmount = ethers.parseEther('1');
  let tokenAmount = ethers.parseEther('100');

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();
    const MultiSend = await ethers.getContractFactory('MultiSend');
    multiSend = await MultiSend.deploy();
    const TestERC20 = await ethers.getContractFactory('TestERC20');
    token = await TestERC20.deploy();
  });

  it('should send native tokens to multiple addresses', async () => {
    const addresses = [
      await user1.getAddress(),
      await user2.getAddress(),
      await user3.getAddress(),
    ];
    const amounts = [nativeAmount, nativeAmount, nativeAmount];
    let oldBalance: bigint[] = [];
    for (let i = 0; i < addresses.length; i++) {
      oldBalance.push(await ethers.provider.getBalance(addresses[i]));
    }
    const tx = await multiSend.multiSend(addresses, amounts, {
      value: nativeAmount * BigInt(3),
    });

    for (let i = 0; i < addresses.length; i++) {
      expect(await ethers.provider.getBalance(addresses[i])).to.equal(
        oldBalance[i] + nativeAmount,
        `Address ${i} failed to receive native tokens.`
      );
    }
  });

  it('should send ERC20 tokens to multiple addresses', async () => {
    await token.approve(await multiSend.getAddress(), ethers.MaxUint256);
    const addresses = [
      await user1.getAddress(),
      await user2.getAddress(),
      await user3.getAddress(),
    ];
    const amounts = [tokenAmount, tokenAmount, tokenAmount];
    const tx = await multiSend.multiSendERC20(
      await token.getAddress(),
      addresses,
      amounts
    );
    for (let i = 0; i < addresses.length; i++) {
      expect(await token.balanceOf(addresses[i])).to.equal(
        tokenAmount,
        `Address ${i} failed to receive ERC20 tokens.`
      );
    }
  });
});
