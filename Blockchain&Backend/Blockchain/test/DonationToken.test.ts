import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

describe("DonationToken", function () {
  let donationToken: any;
  let accessControl: any;
  let owner: any;
  let donor1: any;
  let donor2: any;

  beforeEach(async function () {
    [owner, donor1, donor2] = await ethers.getSigners();

    // Deploy AccessControl
    const AccessControl = await ethers.getContractFactory("DonationAccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();

    // Register donors
    await accessControl.registerDonor(donor1.address);
    await accessControl.registerDonor(donor2.address);

    // Deploy DonationToken
    const DonationToken = await ethers.getContractFactory("DonationToken");
    donationToken = await DonationToken.deploy(await accessControl.getAddress());
    await donationToken.waitForDeployment();
  });

  describe("Donations", function () {
    it("Should accept donations and emit event", async function () {
      const amount = ethers.parseEther("1.0");
      const cause = "Education";

      await expect(
        donationToken.connect(donor1).makeDonation(cause, { value: amount })
      )
        .to.emit(donationToken, "DonationReceived")
        .withArgs(donor1.address, amount, cause, anyValue, 0);
    });

    it("Should track total donations by cause", async function () {
      const cause = "Healthcare";
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("2.0");

      await donationToken.connect(donor1).makeDonation(cause, { value: amount1 });
      await donationToken.connect(donor2).makeDonation(cause, { value: amount2 });

      const total = await donationToken.getTotalDonationsByCause(cause);
      expect(total).to.equal(amount1 + amount2);
    });

    it("Should prevent donations of 0 amount", async function () {
      await expect(
        donationToken.connect(donor1).makeDonation("Education", { value: 0 })
      ).to.be.revertedWith("Donation amount must be greater than 0");
    });

    it("Should prevent donations with empty cause", async function () {
      const amount = ethers.parseEther("1.0");

      await expect(
        donationToken.connect(donor1).makeDonation("", { value: amount })
      ).to.be.revertedWith("Cause cannot be empty");
    });

    it("Should retrieve donations by donor", async function () {
      const amount = ethers.parseEther("1.0");
      const cause = "Education";

      await donationToken.connect(donor1).makeDonation(cause, { value: amount });
      await donationToken.connect(donor1).makeDonation(cause, { value: amount });

      const donations = await donationToken.getDonationsByDonor(donor1.address);
      expect(donations.length).to.equal(2);
    });

    it("Should retrieve all donations", async function () {
      await donationToken.connect(donor1).makeDonation("Education", { value: ethers.parseEther("1.0") });
      await donationToken.connect(donor2).makeDonation("Healthcare", { value: ethers.parseEther("2.0") });

      const allDonations = await donationToken.getAllDonations();
      expect(allDonations.length).to.equal(2);
    });
  });
});
