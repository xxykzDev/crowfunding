// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./DAO.sol";

contract FactoryDAO {
    uint public initialBalance;
    address[] public deployedDAOs;

    function createDAO(address[] memory _members, uint _totalFunds) public returns (address) {
        DAO newDAO = new DAO(_members, _totalFunds);
        deployedDAOs.push(address(newDAO));
        return address(newDAO);
    }


    function getDeployedDAOs() public view returns (address[] memory) {
        return deployedDAOs;
    }

    function setInitialBalance(uint _value) public {
        initialBalance = _value;
    }

    // Esta función permite que el contrato reciba ethers
    receive() external payable {
        initialBalance += msg.value;
    }
}
