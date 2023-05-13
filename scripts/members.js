const { ethers } = require("hardhat");

async function main() {
  const daoAddress = "0x5aCa9a29c87EF57e57131e1fBFf7359DC0e5eFcD";

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
