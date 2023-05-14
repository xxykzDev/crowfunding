// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./DAOFactory.sol";

contract Crowdfunding is AccessControl{
    address public owner;
    FactoryDAO public daoFactory;  // Actualiza el nombre del contrato aquí

    struct Funder {
        address contributor;
        uint amount;
    }

    struct Proposal {
        string name;
        string description;
        uint value;
        uint deadline;
        uint received;
        bool funded;
        Funder[] funders;
        mapping (address => uint) contributions;
    }

    Proposal[] public proposals;

    bytes32 public constant BUILDER_ROLE = keccak256("BUILDER_ROLE");

    constructor(FactoryDAO _daoFactory) {  
        owner = msg.sender;
        daoFactory = _daoFactory;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    receive() external payable {}

    function grantBuilder(address _builder) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(BUILDER_ROLE, _builder);
    }

    function revokeBuilder(address _builder) public onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(BUILDER_ROLE, _builder);
    }

    function newProposal(string memory _name, string memory _description, uint _value, uint _duration) public onlyRole(BUILDER_ROLE) {
        Proposal storage newProp = proposals.push();
        newProp.name = _name;
        newProp.description = _description;
        newProp.value = _value;
        newProp.deadline = block.timestamp + _duration;
        newProp.received = 0;
        newProp.funded = false;
    }

    function contribute(uint _proposal) public payable {
        Proposal storage p = proposals[_proposal];
        require(block.timestamp < p.deadline);
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
                    
                // Crear un nuevo DAO con los miembros y los fondos de la propuesta
                address[] memory members = new address[](p.funders.length);
                for(uint i = 0; i < p.funders.length; i++) {
                    members[i] = p.funders[i].contributor;
                }

                address newDAOAddress = daoFactory.createDAO(members, p.received);
                    
                // Verificar que la dirección del nuevo DAO es válida
                require(newDAOAddress != address(0), "Invalid DAO address");

                // Enviar fondos a la nueva DAO
                (bool success, ) = payable(newDAOAddress).call{value: p.received}("");
                require(success, "Transfer to DAO failed");
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
