// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AccessControl.sol";

contract DonationToken is ReentrancyGuard {
    struct Donation {
        address donor;
        uint256 amount;
        string cause;
        uint256 timestamp;
        uint256 donationId;
    }

    DonationAccessControl private accessControl;
    Donation[] public donations;
    mapping(string => uint256) public totalDonationsByCause;
    mapping(address => uint256[]) public donorDonations;
    mapping(string => uint256[]) public causeDonations;
    uint256 private donationCounter;

    event DonationReceived(
        address indexed donor,
        uint256 amount,
        string indexed cause,
        uint256 timestamp,
        uint256 indexed donationId
    );

    constructor(address _accessControlAddress) {
        accessControl = DonationAccessControl(_accessControlAddress);
    }

    function makeDonation(string memory _cause) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(bytes(_cause).length > 0, "Cause cannot be empty");

        uint256 donationId = donationCounter;
        donationCounter++;

        Donation memory newDonation = Donation({
            donor: msg.sender,
            amount: msg.value,
            cause: _cause,
            timestamp: block.timestamp,
            donationId: donationId
        });

        donations.push(newDonation);
        totalDonationsByCause[_cause] += msg.value;
        donorDonations[msg.sender].push(donationId);
        causeDonations[_cause].push(donationId);

        emit DonationReceived(msg.sender, msg.value, _cause, block.timestamp, donationId);
    }

    function getTotalDonationsByCause(string memory _cause) external view returns (uint256) {
        return totalDonationsByCause[_cause];
    }

    function getDonationsByDonor(address _donor) external view returns (uint256[] memory) {
        return donorDonations[_donor];
    }

    function getDonationsByCause(string memory _cause) external view returns (uint256[] memory) {
        return causeDonations[_cause];
    }

    function getDonationDetails(uint256 _donationId) external view returns (Donation memory) {
        require(_donationId < donations.length, "Donation ID does not exist");
        return donations[_donationId];
    }

    function getAllDonations() external view returns (Donation[] memory) {
        return donations;
    }
}
