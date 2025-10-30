// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DonationAccessControl is AccessControl {
    bytes32 public constant DONOR_ROLE = keccak256("DONOR_ROLE");
    bytes32 public constant CHARITY_ROLE = keccak256("CHARITY_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    event RoleGrantedEvent(address indexed user, bytes32 indexed role, string roleName);
    event RoleRevokedEvent(address indexed user, bytes32 indexed role, string roleName);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function registerCharity(address _charityAddress) external onlyRole(ADMIN_ROLE) {
        _grantRole(CHARITY_ROLE, _charityAddress);
        emit RoleGrantedEvent(_charityAddress, CHARITY_ROLE, "CHARITY");
    }

    function registerDonor(address _donorAddress) external onlyRole(ADMIN_ROLE) {
        _grantRole(DONOR_ROLE, _donorAddress);
        emit RoleGrantedEvent(_donorAddress, DONOR_ROLE, "DONOR");
    }

    function revokeCharity(address _charityAddress) external onlyRole(ADMIN_ROLE) {
        _revokeRole(CHARITY_ROLE, _charityAddress);
        emit RoleRevokedEvent(_charityAddress, CHARITY_ROLE, "CHARITY");
    }

    function isAdmin(address _address) external view returns (bool) {
        return hasRole(ADMIN_ROLE, _address);
    }

    function isCharity(address _address) external view returns (bool) {
        return hasRole(CHARITY_ROLE, _address);
    }

    function isDonor(address _address) external view returns (bool) {
        return hasRole(DONOR_ROLE, _address);
    }
}
