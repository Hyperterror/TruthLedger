// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

contract ProjectMilestone {
    struct MilestoneVerification {
        uint256 milestoneId;
        bool isVerified;
        uint256 verificationDate;
        string verificationProof;
        address verifiedBy;
    }

    DonationAccessControl private accessControl;
    mapping(uint256 => MilestoneVerification) public verifications;
    uint256 public verificationCounter;

    event MilestoneVerificationSubmitted(
        uint256 indexed milestoneId,
        string proofURI,
        uint256 timestamp
    );

    event MilestoneVerificationApproved(
        uint256 indexed milestoneId,
        address indexed verifier,
        uint256 timestamp
    );

    modifier onlyAdmin() {
        require(
            accessControl.isAdmin(msg.sender),
            "Only admins can verify milestones"
        );
        _;
    }

    constructor(address _accessControlAddress) {
        accessControl = DonationAccessControl(_accessControlAddress);
    }

    function submitMilestoneVerification(
        uint256 _milestoneId,
        string memory _proofURI
    ) external {
        require(bytes(_proofURI).length > 0, "Proof URI cannot be empty");

        MilestoneVerification storage verification = verifications[_milestoneId];
        require(!verification.isVerified, "Milestone already verified");

        emit MilestoneVerificationSubmitted(_milestoneId, _proofURI, block.timestamp);
    }

    function approveMilestoneVerification(uint256 _milestoneId)
        external
        onlyAdmin
    {
        MilestoneVerification storage verification = verifications[_milestoneId];
        require(!verification.isVerified, "Already verified");

        verification.milestoneId = _milestoneId;
        verification.isVerified = true;
        verification.verificationDate = block.timestamp;
        verification.verifiedBy = msg.sender;

        emit MilestoneVerificationApproved(_milestoneId, msg.sender, block.timestamp);
    }

    function getVerification(uint256 _milestoneId) 
        external 
        view 
        returns (MilestoneVerification memory) 
    {
        return verifications[_milestoneId];
    }
}
