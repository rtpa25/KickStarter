// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Campaighn {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount; //the yes count
        mapping(address => bool) approvals; //these are the addresses who have voted
    }
    address payable public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint256 private currentIndex = 0;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _; //if this passes the code execution goes down
    }

    constructor(uint256 minimum, address creator) {
        manager = payable(creator);
        minimumContribution = minimum;
    }

    function contribute() public payable {
        //value being the value of the eth contribution the sender has sent with the transaction
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true; //the adress is not stored in the mapping so we cant access the list of keys for a solidity mapping it's like a classic hash table
        approversCount++;
    }

    //function arguments are by default memory vars, hence they are copied when they are passed to the functions and tried to be mutated
    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public payable restricted {
        Request storage newRequestInStorage = requests.push();
        newRequestInStorage.description = description;
        newRequestInStorage.value = value;
        newRequestInStorage.recipient = recipient;
        newRequestInStorage.complete = false;
        newRequestInStorage.approvalCount = 0;
        currentIndex++;
    }

    //array searching is O(N) and search in mapping is constant time so O(1)
    function approveRequest(uint256 index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public payable restricted {
        Request storage request = requests[index];
        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
}

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimumContribution) public {
        address newCampaign = address(
            new Campaighn(minimumContribution, msg.sender)
        ); //deploys the new contract to the blockchain
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}
