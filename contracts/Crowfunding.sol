// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {
    address public owner;

    struct Funder {
        address contributor;
        uint amount;
    }

    struct Proposal {
        string name;
        string description;
        address payable recipient;
        uint value;
        uint deadline;
        uint received;
        bool funded;
        Funder[] funders;
        mapping (address => uint) contributions;
    }

    Proposal[] public proposals;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function newProposal(string memory _name, string memory _description, address payable _recipient, uint _value, uint _duration) public onlyOwner {
        Proposal storage newProp = proposals.push();
        newProp.name = _name;
        newProp.description = _description;
        newProp.recipient = _recipient;
        newProp.value = _value;
        newProp.deadline = block.timestamp + _duration;
        newProp.received = 0;
        newProp.funded = false;
    }

    function contribute(uint _proposal) public payable {
        Proposal storage p = proposals[_proposal];
        require(block.timestamp < p.deadline);
        require(p.received + msg.value <= p.value);
        require(msg.value >= 0.01 ether);
        
        p.contributions[msg.sender] += msg.value;
        p.funders.push(Funder({contributor: msg.sender, amount: msg.value}));
        p.received += msg.value;

        checkProposal(_proposal);
    }

    function checkProposal(uint _proposal) public {
        Proposal storage p = proposals[_proposal];

        if(block.timestamp >= p.deadline) {
            if(p.received < p.value) {
                for(uint i = 0; i < p.funders.length; i++) {
                    refund(_proposal, p.funders[i].contributor);
                }
            } else {
                require(address(this).balance >= p.received);
                require(!p.funded);

                p.funded = true;
                p.recipient.transfer(p.received);
            }
        }
    }

    function refund(uint _proposal, address _contributor) public {
        Proposal storage p = proposals[_proposal];
        require(block.timestamp >= p.deadline);
        require(p.received < p.value);
        require(!p.funded);
        require(p.contributions[_contributor] > 0);

        uint amount = p.contributions[_contributor];
        p.contributions[_contributor] = 0;
        payable(_contributor).transfer(amount);
    }

    function getFunders(uint _proposal) public view returns (Funder[] memory) {
        return proposals[_proposal].funders;
    }
}
