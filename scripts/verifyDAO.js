const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
    const network = "sepolia";
    const contract = "contracts/DAO.sol:DAO";
    const contractAddress = "0x08C02728Aab919F9EA152AE39950fDF8F71eb51C";
    const members = ["0x7CADA9F20C8E02520b902e8219130347D10EE822"];
    const totalFunds = ethers.utils.parseEther("0.01"); // Esto equivale a 1 ether, puedes ajustar según sea necesario.

    await hre.run("verify:verify", {
        network,
        contract,
        address: contractAddress,
        constructorArguments: [members, totalFunds],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
