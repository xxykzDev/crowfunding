const { ethers } = require("hardhat");

async function main() {
  const daoAddress = "0x08C02728Aab919F9EA152AE39950fDF8F71eb51C";

  const DAO = await ethers.getContractFactory("DAO");
  
  const dao = DAO.attach(daoAddress);

  const members = await dao.getMembers();
  
  console.log("Miembros de la DAO:", members);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
