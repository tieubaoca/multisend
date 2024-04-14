// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MultiSend is AccessControl {
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function multiSend(
        address payable[] calldata recipients,
        uint256[] calldata values
    ) external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            recipients.length == values.length,
            "MultiSend: recipients and values length mismatch"
        );
        for (uint256 i = 0; i < recipients.length; i++) {
            recipients[i].transfer(values[i]);
        }
    }

    function multiSendERC20(
        address token,
        address[] calldata recipients,
        uint256[] calldata values
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            recipients.length == values.length,
            "MultiSend: recipients and values length mismatch"
        );
        for (uint256 i = 0; i < recipients.length; i++) {
            (bool success, ) = token.call(
                abi.encodeWithSignature(
                    "transferFrom(address,address,uint256)",
                    msg.sender,
                    recipients[i],
                    values[i]
                )
            );
            require(success, "MultiSend: transfer failed");
        }
    }

    function claimDump(
        address payable recipient
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "MultiSend: caller is not an admin"
        );
        recipient.transfer(address(this).balance);
    }
}
