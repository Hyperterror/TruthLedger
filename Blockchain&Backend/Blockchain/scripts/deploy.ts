import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("\n🚀 DEPLOYING C-DAC SMART CONTRACTS 🚀\n");
  console.log("=" .repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying from: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH\n`);

  // 1. Deploy AccessControl
  console.log("1️⃣  Deploying DonationAccessControl...");
  const AccessControl = await ethers.getContractFactory("DonationAccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  const accessControlAddr = await accessControl.getAddress();
  console.log("✅ AccessControl deployed to:", accessControlAddr);

  // 2. Deploy DonationToken
  console.log("\n2️⃣  Deploying DonationToken...");
  const DonationToken = await ethers.getContractFactory("DonationToken");
  const donationToken = await DonationToken.deploy(accessControlAddr);
  await donationToken.waitForDeployment();
  const donationTokenAddr = await donationToken.getAddress();
  console.log("✅ DonationToken deployed to:", donationTokenAddr);

  // 3. Deploy FundAllocation
  console.log("\n3️⃣  Deploying FundAllocation...");
  const FundAllocation = await ethers.getContractFactory("FundAllocation");
  const fundAllocation = await FundAllocation.deploy(accessControlAddr, donationTokenAddr);
  await fundAllocation.waitForDeployment();
  const fundAllocationAddr = await fundAllocation.getAddress();
  console.log("✅ FundAllocation deployed to:", fundAllocationAddr);

  // 4. Deploy ProjectMilestone
  console.log("\n4️⃣  Deploying ProjectMilestone...");
  const ProjectMilestone = await ethers.getContractFactory("ProjectMilestone");
  const projectMilestone = await ProjectMilestone.deploy(accessControlAddr);
  await projectMilestone.waitForDeployment();
  const projectMilestoneAddr = await projectMilestone.getAddress();
  console.log("✅ ProjectMilestone deployed to:", projectMilestoneAddr);

  // Summary
  console.log("\n" + "=" .repeat(50));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=" .repeat(50));
  console.log(`AccessControl:   ${accessControlAddr}`);
  console.log(`DonationToken:   ${donationTokenAddr}`);
  console.log(`FundAllocation:  ${fundAllocationAddr}`);
  console.log(`ProjectMilestone: ${projectMilestoneAddr}`);

  // Save deployment info
  const deploymentInfo = {
    network: "polygon_testnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      accessControl: accessControlAddr,
      donationToken: donationTokenAddr,
      fundAllocation: fundAllocationAddr,
      projectMilestone: projectMilestoneAddr
    }
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n✅ Deployment info saved to deployment-info.json");
  console.log("=" .repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
