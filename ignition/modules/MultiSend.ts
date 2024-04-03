import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const MultiSendModule = buildModule('MultiSendModule', (m) => {
  const multiSend = m.contract('MultiSend', []);
  return { multiSend };
});

export default MultiSendModule;
