const { ethers } = require("hardhat");
const { execSync } = require("child_process");
const fs = require("fs");

async function main() {
  // Obtén la cuenta que desplegará los contratos
  const [deployer] = await ethers.getSigners();

  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Lee la dirección del contrato DAOFactory desde el archivo
  const daoFactoryAddress = fs.readFileSync("daoFactoryAddress.txt", "utf8").trim();

  // Despliega el contrato Crowdfunding
  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy(daoFactoryAddress);

  await crowdfunding.deployed();

  console.log("Crowdfunding desplegado en:", crowdfunding.address);

  // Guarda la dirección del contrato Crowdfunding en un archivo
  fs.writeFileSync("crowdfundingAddress.txt", crowdfunding.address);

  
  
  // Lee la dirección del contrato Crowdfunding desde el archivo
  const crowdfundingAddress = fs.readFileSync("crowdfundingAddress.txt", "utf8").trim();
  
  await verifyContracts(crowdfundingAddress, daoFactoryAddress);
}

async function verifyContracts(crowdfundingAddress, daoFactoryAddress) {
  if (crowdfundingAddress && daoFactoryAddress) {
    console.log("Esperando 15 segundos antes de verificar el contrato...");
    // Espera 15 segundos adicionales antes de verificar el contrato
    await new Promise(resolve => setTimeout(resolve, 15000));
    try {
      execSync(`npx hardhat verify --network sepolia ${crowdfundingAddress} ${daoFactoryAddress}`, { stdio: "inherit" });
      console.log("Verificación completada exitosamente.");
    } catch (error) {
      console.error("Ocurrió un error al verificar los contratos:", error);
      process.exit(1);
    }
  } else {
    console.error("No se encontraron las direcciones de los contratos.");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
