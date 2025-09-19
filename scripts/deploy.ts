import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy CipherVoteParliament contract
  const CipherVoteParliament = await ethers.getContractFactory("CipherVoteParliament");
  const verifier = deployer.address; // Use deployer as verifier for now
  const cipherVoteParliament = await CipherVoteParliament.deploy(verifier);

  await cipherVoteParliament.waitForDeployment();

  const contractAddress = await cipherVoteParliament.getAddress();
  console.log("CipherVoteParliament deployed to:", contractAddress);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    verifier,
    deployer: deployer.address,
    network: "sepolia",
    timestamp: new Date().toISOString()
  };
  
  console.log("Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
