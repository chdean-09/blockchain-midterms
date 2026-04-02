import { ethers } from "hardhat";

async function main() {
  const tipPost = await ethers.deployContract("TipPost");
  await tipPost.waitForDeployment();

  const address = await tipPost.getAddress();
  console.log(`TipPost deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
