const { ethers } = require("hardhat");
const { execSync } = require("child_process");
const fs = require("fs");

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
    value: ethers.utils.parseEther("0.01")
  });

  // Guarda la dirección del contrato DAOFactory en un archivo
  fs.writeFileSync("daoFactoryAddress.txt", daoFactory.address);

  // Espera 5 segundos utilizando una promesa
  await new Promise(resolve => setTimeout(resolve, 5000));

  await verifyContract();
}

async function verifyContract() {
  const address = fs.readFileSync("daoFactoryAddress.txt", "utf8").trim();

  if (address) {
    try {
      // Espera 20 segundos adicionales antes de verificar el contrato
      console.log('esperando que se distribuya el bytecde...')
      await new Promise(resolve => setTimeout(resolve, 20000));

      execSync(`npx hardhat verify --network sepolia ${address}`, { stdio: "inherit" });
      console.log("Verificación completada exitosamente.");
    } catch (error) {
      console.error("Ocurrió un error al verificar el contrato:", error);
      process.exit(1);
    }
  } else {
    console.error("No se encontró la dirección del contrato DAOFactory.");
    process.exit(1);
  }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
