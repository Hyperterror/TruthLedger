import { expect } from "chai";
import { ethers } from "hardhat";

describe("FundAllocation", function () {
  let fundAllocation: any;
  let donationToken: any;
  let accessControl: any;
  let owner: any;
  let charity1: any;
  let donor1: any;
  let beneficiary1: any;

  beforeEach(async function () {
    [owner, charity1, donor1, beneficiary1] = await ethers.getSigners();

    // Deploy AccessControl
    const AccessControl = await ethers.getContractFactory("DonationAccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();

    // Register charity
    await accessControl.registerCharity(charity1.address);

    // Deploy DonationToken
    const DonationToken = await ethers.getContractFactory("DonationToken");
    donationToken = await DonationToken.deploy(await accessControl.getAddress());
    await donationToken.waitForDeployment();

    // Deploy FundAllocation
    const FundAllocation = await ethers.getContractFactory("FundAllocation");
    fundAllocation = await FundAllocation.deploy(
      await accessControl.getAddress(),
      await donationToken.getAddress()
    );
    await fundAllocation.waitForDeployment();
  });

  describe("Project Creation", function () {
    it("Should allow charity to create project with milestones", async function () {
      const fundAmount = ethers.parseEther("10.0");
      const descriptions = ["Phase 1", "Phase 2"];
      const percentages = [50n, 50n];

      await expect(
        fundAllocation.connect(charity1).createProject(
          "Education Program",
          beneficiary1.address,
          fundAmount,
          descriptions,
          percentages
        )
      )
        .to.emit(fundAllocation, "ProjectCreated")
        .withArgs(0, "Education Program", beneficiary1.address, fundAmount);
    });

    it("Should prevent non-charity from creating project", async function () {
      const fundAmount = ethers.parseEther("10.0");
      const descriptions = ["Phase 1"];
      const percentages = [100n];

      await expect(
        fundAllocation.connect(donor1).createProject(
          "Education Program",
          beneficiary1.address,
          fundAmount,
          descriptions,
          percentages
        )
      ).to.be.revertedWith("Only registered charities can create projects");
    });

    it("Should validate milestone percentages sum to 100", async function () {
      const fundAmount = ethers.parseEther("10.0");
      const descriptions = ["Phase 1", "Phase 2"];
      const percentages = [50n, 40n]; // Sum = 90, not 100

      await expect(
        fundAllocation.connect(charity1).createProject(
          "Education Program",
          beneficiary1.address,
          fundAmount,
          descriptions,
          percentages
        )
      ).to.be.revertedWith("Fund percentages must sum to 100");
    });
  });

  describe("Milestone Verification", function () {
    beforeEach(async function () {
      // Create a project first
      const fundAmount = ethers.parseEther("10.0");
      const descriptions = ["Phase 1", "Phase 2"];
      const percentages = [50n, 50n];

      await fundAllocation.connect(charity1).createProject(
        "Education Program",
        beneficiary1.address,
        fundAmount,
        descriptions,
        percentages
      );
    });

    it("Should allow admin to verify milestone", async function () {
      await expect(fundAllocation.verifyMilestone(0, 0))
        .to.emit(fundAllocation, "MilestoneVerified")
        .withArgs(0, 0, ethers.parseEther("5.0"));
    });

    it("Should prevent non-admin from verifying milestone", async function () {
      await expect(
        fundAllocation.connect(donor1).verifyMilestone(0, 0)
      ).to.be.revertedWith("Only admins can verify milestones");
    });

    it("Should prevent double verification of milestone", async function () {
      await fundAllocation.verifyMilestone(0, 0);

      await expect(fundAllocation.verifyMilestone(0, 0))
        .to.be.revertedWith("Milestone already verified");
    });
  });
});
