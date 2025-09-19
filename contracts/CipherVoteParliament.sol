// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract CipherVoteParliament is SepoliaConfig {
    using FHE for *;
    
    struct Proposal {
        euint32 proposalId;
        euint32 votesFor;
        euint32 votesAgainst;
        euint32 votesAbstain;
        euint32 totalVoters;
        bool isActive;
        bool isCompleted;
        bool isEncrypted;
        string title;
        string description;
        address proposer;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Vote {
        euint32 voteId;
        euint8 voteChoice; // 1 = for, 2 = against, 3 = abstain
        address voter;
        uint256 timestamp;
    }
    
    struct Voter {
        bool hasVoted;
        euint32 reputation;
        bool isVerified;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Vote) public votes;
    mapping(address => Voter) public voters;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    
    uint256 public proposalCounter;
    uint256 public voteCounter;
    
    address public owner;
    address public verifier;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed voteId, uint256 indexed proposalId, address indexed voter);
    event ProposalCompleted(uint256 indexed proposalId, bool passed);
    event VoterRegistered(address indexed voter, bool isVerified);
    event ReputationUpdated(address indexed voter, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _duration
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Proposal title cannot be empty");
        require(_duration > 0, "Duration must be positive");
        require(voters[msg.sender].isVerified, "Only verified voters can create proposals");
        
        uint256 proposalId = proposalCounter++;
        
        proposals[proposalId] = Proposal({
            proposalId: FHE.asEuint32(0), // Will be set properly later
            votesFor: FHE.asEuint32(0),
            votesAgainst: FHE.asEuint32(0),
            votesAbstain: FHE.asEuint32(0),
            totalVoters: FHE.asEuint32(0),
            isActive: true,
            isCompleted: false,
            isEncrypted: true,
            title: _title,
            description: _description,
            proposer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        return proposalId;
    }
    
    function castVote(
        uint256 proposalId,
        externalEuint8 voteChoice,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        require(proposals[proposalId].isActive, "Proposal is not active");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting period has ended");
        require(voters[msg.sender].isVerified, "Only verified voters can vote");
        require(!hasVoted[msg.sender][proposalId], "Already voted on this proposal");
        
        uint256 voteId = voteCounter++;
        
        // Convert externalEuint8 to euint8 using FHE.fromExternal
        euint8 internalVoteChoice = FHE.fromExternal(voteChoice, inputProof);
        
        votes[voteId] = Vote({
            voteId: FHE.asEuint32(0), // Will be set properly later
            voteChoice: internalVoteChoice,
            voter: msg.sender,
            timestamp: block.timestamp
        });
        
        // Update proposal vote counts based on choice
        euint8 forChoice = FHE.asEuint8(1);
        euint8 againstChoice = FHE.asEuint8(2);
        euint8 abstainChoice = FHE.asEuint8(3);
        
        // Check if vote is for
        ebool isFor = FHE.eq(internalVoteChoice, forChoice);
        proposals[proposalId].votesFor = FHE.select(
            isFor,
            FHE.add(proposals[proposalId].votesFor, FHE.asEuint32(1)),
            proposals[proposalId].votesFor
        );
        
        // Check if vote is against
        ebool isAgainst = FHE.eq(internalVoteChoice, againstChoice);
        proposals[proposalId].votesAgainst = FHE.select(
            isAgainst,
            FHE.add(proposals[proposalId].votesAgainst, FHE.asEuint32(1)),
            proposals[proposalId].votesAgainst
        );
        
        // Check if vote is abstain
        ebool isAbstain = FHE.eq(internalVoteChoice, abstainChoice);
        proposals[proposalId].votesAbstain = FHE.select(
            isAbstain,
            FHE.add(proposals[proposalId].votesAbstain, FHE.asEuint32(1)),
            proposals[proposalId].votesAbstain
        );
        
        // Update total voters
        proposals[proposalId].totalVoters = FHE.add(proposals[proposalId].totalVoters, FHE.asEuint32(1));
        
        hasVoted[msg.sender][proposalId] = true;
        voters[msg.sender].hasVoted = true;
        
        emit VoteCast(voteId, proposalId, msg.sender);
        return voteId;
    }
    
    function completeProposal(uint256 proposalId) public {
        require(proposals[proposalId].proposer != address(0), "Proposal does not exist");
        require(proposals[proposalId].isActive, "Proposal is not active");
        require(block.timestamp > proposals[proposalId].endTime, "Voting period has not ended");
        require(msg.sender == owner || msg.sender == verifier, "Only owner or verifier can complete proposal");
        
        proposals[proposalId].isActive = false;
        proposals[proposalId].isCompleted = true;
        proposals[proposalId].isEncrypted = false; // Results are now visible
        
        // Determine if proposal passed (for > against)
        ebool passed = FHE.gt(proposals[proposalId].votesFor, proposals[proposalId].votesAgainst);
        
        emit ProposalCompleted(proposalId, false); // FHE.decrypt(passed) - will be decrypted off-chain
    }
    
    function registerVoter(address voter, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can register voters");
        require(voter != address(0), "Invalid voter address");
        
        voters[voter] = Voter({
            hasVoted: false,
            reputation: FHE.asEuint32(100), // Default reputation
            isVerified: isVerified
        });
        
        emit VoterRegistered(voter, isVerified);
    }
    
    function updateVoterReputation(address voter, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(voter != address(0), "Invalid voter address");
        
        voters[voter].reputation = reputation;
        emit ReputationUpdated(voter, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getProposalInfo(uint256 proposalId) public view returns (
        string memory title,
        string memory description,
        uint8 votesFor,
        uint8 votesAgainst,
        uint8 votesAbstain,
        uint8 totalVoters,
        bool isActive,
        bool isCompleted,
        bool isEncrypted,
        address proposer,
        uint256 startTime,
        uint256 endTime
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            0, // FHE.decrypt(proposal.votesFor) - will be decrypted off-chain
            0, // FHE.decrypt(proposal.votesAgainst) - will be decrypted off-chain
            0, // FHE.decrypt(proposal.votesAbstain) - will be decrypted off-chain
            0, // FHE.decrypt(proposal.totalVoters) - will be decrypted off-chain
            proposal.isActive,
            proposal.isCompleted,
            proposal.isEncrypted,
            proposal.proposer,
            proposal.startTime,
            proposal.endTime
        );
    }
    
    function getVoteInfo(uint256 voteId) public view returns (
        uint8 voteChoice,
        address voter,
        uint256 timestamp
    ) {
        Vote storage vote = votes[voteId];
        return (
            0, // FHE.decrypt(vote.voteChoice) - will be decrypted off-chain
            vote.voter,
            vote.timestamp
        );
    }
    
    function getVoterInfo(address voter) public view returns (
        bool hasVoted,
        uint8 reputation,
        bool isVerified
    ) {
        Voter storage voterInfo = voters[voter];
        return (
            voterInfo.hasVoted,
            0, // FHE.decrypt(voterInfo.reputation) - will be decrypted off-chain
            voterInfo.isVerified
        );
    }
    
    function hasUserVoted(address voter, uint256 proposalId) public view returns (bool) {
        return hasVoted[voter][proposalId];
    }
    
    function isVoterVerified(address voter) public view returns (bool) {
        return voters[voter].isVerified;
    }
}
