// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract DAO {
    address[] public members;
    mapping(address => bool) public isMember;
    uint public totalFunds;

    constructor(address[] memory _members, uint _totalFunds) {
        for (uint i = 0; i < _members.length; i++) {
            members.push(_members[i]);
            isMember[_members[i]] = true;
        }

        totalFunds = _totalFunds;
    }

    function withdrawFunds(uint _amount) public {
        require(isMember[msg.sender], "Only members can withdraw funds.");
        require(_amount <= totalFunds, "Not enough funds available.");

        totalFunds -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function getMembers() public view returns (address[] memory) {
        return members;
    }
}