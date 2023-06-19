const { ethers } = require("hardhat");

async function main() {
  // Obtén la cuenta que enviará el ETH
  const [sender] = await ethers.getSigners();

  // Dirección del contrato a la que se enviarán los fondos
  const contractAddress = "0x3FA062cB56bcB9E7400f94df1Dc0e2321C08d48C";

  console.log("Enviando ETH con la cuenta:", sender.address);

  // Envía 0.05 ETH al contrato
  const transaction = await sender.sendTransaction({
    to: contractAddress,
    value: ethers.utils.parseEther("0.05"),
  });

  // Espera a que se mine la transacción
  await transaction.wait();

  console.log("Se han enviado 0.05 ETH al contrato:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
