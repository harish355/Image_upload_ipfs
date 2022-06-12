// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImageUpload {
    struct User_data {
        string name;
        uint256 image_count;
        string[] hashes;
        bool isCreated;
    }

    mapping(address => User_data) Accounts;

    function isCreated() public view returns (bool) {
        return Accounts[msg.sender].isCreated;
    }

    function create(string memory _name) public {
        Accounts[msg.sender].name = _name;
        Accounts[msg.sender].isCreated = true;
    }

    function getImage_Hashes() public view returns (string[] memory) {
        return Accounts[msg.sender].hashes;
    }

    function Push_toList(string memory _hash) public {
        Accounts[msg.sender].hashes.push(_hash);
        Accounts[msg.sender].image_count++;
    }
}
