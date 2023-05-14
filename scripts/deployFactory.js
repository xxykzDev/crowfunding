const { ethers } = require("hardhat");

async function main() {
  // Obtén la cuenta que desplegará el contrato
  const [deployer] = await ethers.getSigners();

  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Despliega el contrato DAOFactory
  const DAOFactory = await ethers.getContractFactory("FactoryDAO");
  const daoFactory = await DAOFactory.deploy();

  await daoFactory.deployed();

  console.log("DAOFactory desplegado en:", daoFactory.address);

  // Envía 0.1 ETH al contrato DAOFactory
  await deployer.sendTransaction({
    to: daoFactory.address,
    value: ethers.utils.parseEther("0.03")
  });

  const balance = await ethers.provider.getBalance(daoFactory.address);
  console.log("DAOFactory balance:", ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
