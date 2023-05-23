const { ethers } = require("hardhat");

async function main() {
  // Obtén la cuenta que desplegará el contrato
  const [deployer] = await ethers.getSigners();

  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Dirección del contrato DAOFactory deployado previamente
  const daoFactoryAddress = "0xCE5DC8F3b769645E6880F0208f7ed1c725512ac6";

  // Crea una instancia del contrato DAOFactory
  const DAOFactory = await ethers.getContractFactory("FactoryDAO");
  const daoFactory = DAOFactory.attach(daoFactoryAddress);

  // Despliega el contrato Crowdfunding
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy(daoFactory.address);

  await crowdfunding.deployed();

  console.log("Crowdfunding desplegado en:", crowdfunding.address);

  await deployer.sendTransaction({
    to: crowdfunding.address,
    value: ethers.utils.parseEther("0.01")
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
