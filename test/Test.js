const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("FactoryDAO", function () {
  let FactoryDAO;
  let factoryDAO;
  let accounts;

  beforeEach(async function () {
    // Obtén las cuentas del entorno de prueba
    accounts = await ethers.getSigners();

    // Compila y despliega el contrato FactoryDAO antes de cada prueba
    FactoryDAO = await ethers.getContractFactory("FactoryDAO");
    factoryDAO = await FactoryDAO.deploy();
    await factoryDAO.deployed();
  });

  it("Should create a new DAO", async function () {
    // Crea un nuevo DAO usando el contrato FactoryDAO
    const members = [accounts[0].address, accounts[1].address];
    const totalFunds = ethers.utils.parseEther("10");

    await factoryDAO.createDAO(members, totalFunds);

    // Obtiene los DAOs desplegados
    const deployedDAOs = await factoryDAO.getDeployedDAOs();

    // Verifica que se haya creado el DAO correctamente
    expect(deployedDAOs.length).to.equal(1);
  });

  it("Should return the list of deployed DAOs", async function () {
    // Crea algunos DAOs usando el contrato FactoryDAO
    const members1 = [accounts[0].address, accounts[1].address];
    const totalFunds1 = ethers.utils.parseEther("10");
    await factoryDAO.createDAO(members1, totalFunds1);
  
    const members2 = [accounts[2].address, accounts[3].address];
    const totalFunds2 = ethers.utils.parseEther("5");
    await factoryDAO.createDAO(members2, totalFunds2);
  
    // Obtiene los DAOs desplegados
    const deployedDAOs = await factoryDAO.getDeployedDAOs();
  
    // Verifica que los DAOs desplegados coincidan con los creados previamente
    expect(deployedDAOs.length).to.equal(2);
    expect(deployedDAOs[0]).to.not.be.undefined;
    expect(deployedDAOs[1]).to.not.be.undefined;
  });
  
  it("Should receive ethers", async function () {
    const amount = ethers.utils.parseEther("1");
  
    // Envía ethers al contrato
    await accounts[0].sendTransaction({
      to: factoryDAO.address,
      value: amount,
    });
  
    // Verifica que el saldo del contrato se haya actualizado correctamente
    expect(await ethers.provider.getBalance(factoryDAO.address)).to.equal(amount);
  });

  describe("Crowdfunding", function () {
    let Crowdfunding;
    let crowdfunding;
    let FactoryDAO;
    let factoryDAO;
    let accounts;
  
    beforeEach(async function () {
      // Obtén las cuentas del entorno de prueba
      accounts = await ethers.getSigners();
  
      // Compila y despliega el contrato FactoryDAO antes de cada prueba
      FactoryDAO = await ethers.getContractFactory("FactoryDAO");
      factoryDAO = await FactoryDAO.deploy();
      await factoryDAO.deployed();
  
      // Compila y despliega el contrato Crowdfunding antes de cada prueba
      Crowdfunding = await ethers.getContractFactory("Crowdfunding");
      crowdfunding = await Crowdfunding.deploy(factoryDAO.address);
      await crowdfunding.deployed();
    });
  
    it("Should create a new proposal", async function () {
      const proposalName = "New Proposal";
      const proposalShortDescription = "Short Description";
      const proposalLongDescription = "Long Description";
      const proposalEstimatedRevenue = "1000 ETH";
      const proposalValue = ethers.utils.parseEther("10");
      const proposalDuration = 3600; // 1 hour
  
      // Grant Builder Role
      await crowdfunding.grantBuilder(accounts[0].address);

      // Crear una nueva propuesta usando el contrato Crowdfunding
      await crowdfunding.newProposal(
        proposalName,
        proposalShortDescription,
        proposalLongDescription,
        proposalEstimatedRevenue,
        { country: "Country", state: "State", city: "City", proposalAddress: "Address" },
        proposalValue,
        proposalDuration
      );
  
      // Obtener el número total de propuestas
      const totalProposals = await crowdfunding.getTotalProposals();
  
      // Verificar que se haya creado la propuesta correctamente
      expect(totalProposals).to.equal(1);
    });
  
    it("Should contribute to a proposal", async function () {
      const proposalValue = ethers.utils.parseEther("10");
  
      // Crear una nueva propuesta usando el contrato Crowdfunding
      await crowdfunding.newProposal(
        "New Proposal",
        "Short Description",
        "Long Description",
        "1000 ETH",
        { country: "Country", state: "State", city: "City", proposalAddress: "Address" },
        proposalValue,
        3600 // 1 hour
      );
  
      // Contribuir a la propuesta
      await crowdfunding.connect(accounts[0]).contribute(0, { value: ethers.utils.parseEther("1") });
  
      // Obtener los detalles de la propuesta después de la contribución
      const proposal = await crowdfunding.proposals(0);
  
      // Verificar que se haya realizado la contribución correctamente
      expect(proposal.contributions[accounts[0].address]).to.equal(ethers.utils.parseEther("1"));
      expect(proposal.received).to.equal(ethers.utils.parseEther("1"));
    });
  
    // Agrega más pruebas aquí...
  
  });
  
});