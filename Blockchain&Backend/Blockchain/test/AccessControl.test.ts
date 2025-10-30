import { expect } from "chai";
import { ethers } from "hardhat";

describe("DonationAccessControl", function () {
  let accessControl: any;
  let owner: any;
  let charity1: any;
  let charity2: any;
  let donor1: any;
  let donor2: any;

  beforeEach(async function () {
    [owner, charity1, charity2, donor1, donor2] = await ethers.getSigners();

    const AccessControl = await ethers.getContractFactory("DonationAccessControl");
    accessControl = await AccessControl.deploy();
    await accessControl.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should assign admin role to deployer", async function () {
      const isAdmin = await accessControl.isAdmin(owner.address);
      expect(isAdmin).to.be.true;
    });
  });

  describe("Charity Registration", function () {
    it("Should allow admin to register charity", async function () {
      await accessControl.registerCharity(charity1.address);
      const isCharity = await accessControl.isCharity(charity1.address);
      expect(isCharity).to.be.true;
    });

    it("Should emit RoleGrantedEvent when registering charity", async function () {
      await expect(accessControl.registerCharity(charity1.address))
        .to.emit(accessControl, "RoleGrantedEvent")
        .withArgs(charity1.address, ethers.id("CHARITY_ROLE"), "CHARITY");
    });

    it("Should prevent non-admin from registering charity", async function () {
      await expect(
        accessControl.connect(donor1).registerCharity(charity1.address)
      ).to.be.revertedWithCustomError(accessControl, "AccessControlUnauthorizedAccount");
    });

    it("Should allow revoking charity role", async function () {
      await accessControl.registerCharity(charity1.address);
      expect(await accessControl.isCharity(charity1.address)).to.be.true;

      await accessControl.revokeCharity(charity1.address);
      expect(await accessControl.isCharity(charity1.address)).to.be.false;
    });
  });

  describe("Donor Registration", function () {
    it("Should allow admin to register donor", async function () {
      await accessControl.registerDonor(donor1.address);
      const isDonor = await accessControl.isDonor(donor1.address);
      expect(isDonor).to.be.true;
    });

    it("Should prevent non-admin from registering donor", async function () {
      await expect(
        accessControl.connect(charity1).registerDonor(donor1.address)
      ).to.be.revertedWithCustomError(accessControl, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Multiple Registrations", function () {
    it("Should handle multiple charity registrations", async function () {
      await accessControl.registerCharity(charity1.address);
      await accessControl.registerCharity(charity2.address);

      expect(await accessControl.isCharity(charity1.address)).to.be.true;
      expect(await accessControl.isCharity(charity2.address)).to.be.true;
    });

    it("Should handle multiple donor registrations", async function () {
      await accessControl.registerDonor(donor1.address);
      await accessControl.registerDonor(donor2.address);

      expect(await accessControl.isDonor(donor1.address)).to.be.true;
      expect(await accessControl.isDonor(donor2.address)).to.be.true;
    });
  });
});
