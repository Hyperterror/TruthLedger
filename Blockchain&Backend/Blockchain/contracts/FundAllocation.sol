// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./AccessControl.sol";
import "./DonationToken.sol";

contract FundAllocation is ReentrancyGuard {
    struct Milestone {
        string description;
        uint256 fundPercentage; // e.g., 30 = 30%
        bool isVerified;
        uint256 completionDate;
    }

    struct Project {
        uint256 projectId;
        string name;
        address beneficiary;
        uint256 totalFunds;
        uint256 allocatedFunds;
        uint256 releasedFunds;
        Milestone[] milestones;
        bool isActive;
        uint256 createdAt;
    }

    DonationAccessControl private accessControl;
    DonationToken private donationToken;

    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public beneficiaryProjects;
    uint256 public projectCounter;

    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed beneficiary,
        uint256 totalFunds
    );

    event MilestoneVerified(
        uint256 indexed projectId,
        uint256 milestoneIndex,
        uint256 fundsReleased
    );

    event FundsReleased(
        uint256 indexed projectId,
        address indexed beneficiary,
        uint256 amount
    );

    event ProjectClosed(uint256 indexed projectId);

    modifier onlyCharity() {
        require(
            accessControl.isCharity(msg.sender),
            "Only registered charities can create projects"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            accessControl.isAdmin(msg.sender),
            "Only admins can verify milestones"
        );
        _;
    }

    constructor(address _accessControlAddress, address _donationTokenAddress) {
        accessControl = DonationAccessControl(_accessControlAddress);
        donationToken = DonationToken(_donationTokenAddress);
    }

    function createProject(
        string memory _name,
        address _beneficiary,
        uint256 _totalFunds,
        string[] memory _milestoneDescriptions,
        uint256[] memory _fundPercentages
    ) external onlyCharity nonReentrant {
        require(_totalFunds > 0, "Project fund must be greater than 0");
        require(_milestoneDescriptions.length > 0, "At least one milestone required");
        require(
            _milestoneDescriptions.length == _fundPercentages.length,
            "Milestone descriptions and percentages mismatch"
        );

        uint256 totalPercentage = 0;
        for (uint256 i = 0; i < _fundPercentages.length; i++) {
            totalPercentage += _fundPercentages[i];
        }
        require(totalPercentage == 100, "Fund percentages must sum to 100");

        uint256 projectId = projectCounter;
        projectCounter++;

        Project storage newProject = projects[projectId];
        newProject.projectId = projectId;
        newProject.name = _name;
        newProject.beneficiary = _beneficiary;
        newProject.totalFunds = _totalFunds;
        newProject.isActive = true;
        newProject.createdAt = block.timestamp;

        for (uint256 i = 0; i < _milestoneDescriptions.length; i++) {
            newProject.milestones.push(
                Milestone({
                    description: _milestoneDescriptions[i],
                    fundPercentage: _fundPercentages[i],
                    isVerified: false,
                    completionDate: 0
                })
            );
        }

        beneficiaryProjects[_beneficiary].push(projectId);

        emit ProjectCreated(projectId, _name, _beneficiary, _totalFunds);
    }

    function verifyMilestone(uint256 _projectId, uint256 _milestoneIndex)
        external
        onlyAdmin
        nonReentrant
    {
        require(_projectId < projectCounter, "Project does not exist");
        require(projects[_projectId].isActive, "Project is not active");

        Project storage project = projects[_projectId];
        require(_milestoneIndex < project.milestones.length, "Milestone does not exist");

        Milestone storage milestone = project.milestones[_milestoneIndex];
        require(!milestone.isVerified, "Milestone already verified");

        milestone.isVerified = true;
        milestone.completionDate = block.timestamp;

        uint256 fundsToRelease = (project.totalFunds * milestone.fundPercentage) / 100;
        project.allocatedFunds += fundsToRelease;

        emit MilestoneVerified(_projectId, _milestoneIndex, fundsToRelease);
    }

    function releaseFunds(uint256 _projectId) external nonReentrant {
        require(_projectId < projectCounter, "Project does not exist");

        Project storage project = projects[_projectId];
        require(project.isActive, "Project is not active");
        require(project.allocatedFunds > project.releasedFunds, "No funds to release");

        uint256 amountToRelease = project.allocatedFunds - project.releasedFunds;
        project.releasedFunds += amountToRelease;

        (bool success, ) = project.beneficiary.call{value: amountToRelease}("");
        require(success, "Fund transfer failed");

        emit FundsReleased(_projectId, project.beneficiary, amountToRelease);
    }

    function getProjectDetails(uint256 _projectId) external view returns (Project memory) {
        require(_projectId < projectCounter, "Project does not exist");
        return projects[_projectId];
    }

    function getMilestones(uint256 _projectId) external view returns (Milestone[] memory) {
        require(_projectId < projectCounter, "Project does not exist");
        return projects[_projectId].milestones;
    }

    receive() external payable {}
}
