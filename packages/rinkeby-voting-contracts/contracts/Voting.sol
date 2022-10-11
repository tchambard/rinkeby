// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

/** 
 * @title Alyra Project 1: Voting system
 * @author Teddy Chambard
 * @notice This contract defines a basic voting session including different steps:
 * 1) voters registration
 * 2) proposals registration
 * 3) votes recording
 * 4) votes talling
 * 
 * @dev Owner contract account is needed for changing the session status and activate next session step.
 * The word `Administrator` in contract documentation corresponds to contract owner.
 * @custom:experimental This is only an exercice.
 */
contract Voting is Ownable {

    // ===============
    // types
    // ===============

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint8 votedProposalId;
        uint8 nbProposals;
    }

    struct Proposal {
        string description;
        uint voteCount;
        address proposer;
    }

    struct Result {
        Proposal[] winningProposals;
        uint blankVotes;
        uint totalVotes;
        uint abstention;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }


    // ===============
    // events
    // ===============

    event VoterRegistered(address voterAddress);

    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    event ProposalRegistered(uint8 proposalId);

    event Voted (address voter, uint8 proposalId);

    // ===============
    // storage
    // ===============

    /**
     * @dev status is initialized to RegisteringVoters at deployment
     */
    WorkflowStatus public status = WorkflowStatus.RegisteringVoters;

    /**
     * @dev voters mapping is private because we do not want to expose votes to public
     * However votes are visible for administrator and voters through getVoter function.
     */
    mapping(address => Voter) private voters;

    /**
     * @dev votersCount will be used to compute abstention
     */
    uint private votersCount;

    /**
     * @dev Anyone can consult proposals.
     */
    Proposal[] public proposals;
        
    /**
     * @dev Anyone can consult final voting result.
     * The result contains winning proposals but also informations about blank votes, abstention and total registered voters count.
     */
    Result public result;

    // ===============
    // modifiers
    // ===============
    /**
     * @dev Throws if called when `status` is not the expected one.
     */
    modifier statusIs(WorkflowStatus _status) {
        require(_status == status, string.concat('Unexpected voting session status: expected=', Strings.toString(uint(_status)), ' current=', Strings.toString(uint(status))));
        _;
    }

    /**
     * @dev Throws if called by any account not registered as voter.
     */
    modifier onlyVoter() {
        require(voters[msg.sender].isRegistered, 'Caller is not registered voter');
        _;
    }

    // ===============
    // only owner functions
    // ===============
    /**
     * Administrator can register voters.
     * 
     * @dev voters can be added only by contract owner when `status` is set to RegisteringVoters
     * An event VoterRegistered is emitted
     * 
     * @param _voter The address to add into voters registry
     */
    function registerVoter(address _voter) external onlyOwner statusIs(WorkflowStatus.RegisteringVoters) {
        require(!voters[_voter].isRegistered, 'Voter is already registered');
        voters[_voter] = Voter(true, false, 0, 0);
        votersCount++;
        emit VoterRegistered(_voter);
    }

    /**
     * Administrator can close voters registration and open proposals registration.
     * 
     * @dev Can be called only when `status` is set to RegisteringVoters.
     * Two default proposals are registered at the beginning of this step: `Abstention` and `Blank`.
     * That means a registered voter that forget to vote will be counted as `abstention` thanks to `proposals` array index 0
     * An event WorkflowStatusChange is emitted
     */
    function startProposalsRegistration() external onlyOwner statusIs(WorkflowStatus.RegisteringVoters) {
        proposals.push(Proposal('Abstention', 0, msg.sender));
        proposals.push(Proposal('Blank', 0, msg.sender));
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * Administrator can close proposals registration.
     * 
     * @dev Can be called only when `status` is set to ProposalsRegistrationStarted.
     * An event WorkflowStatusChange is emitted
     */
    function stopProposalsRegistration() external onlyOwner statusIs(WorkflowStatus.ProposalsRegistrationStarted) {
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * Administrator can open voting session.
     * 
     * @dev Can be called only when `status` is set to ProposalsRegistrationEnded.
     * An event WorkflowStatusChange is emitted
     */
    function startVotingSession() external onlyOwner statusIs(WorkflowStatus.ProposalsRegistrationEnded) {
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * Administrator can close voting session.
     * 
     * @dev Can be called only when `status` is set to VotingSessionStarted.
     * An event WorkflowStatusChange is emitted
     */
    function stopVotingSession() external onlyOwner statusIs(WorkflowStatus.VotingSessionStarted) {
        status = WorkflowStatus.VotingSessionEnded;
        result.abstention = votersCount - result.totalVotes;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * Administrator triggers votes talling.
     * 
     * @dev After votes talling, it is possible that we got many winning proposals.
     * Votes talling can be triggered only by contract owner when `status` is set to VotingSessionEnded
     * An event WorkflowStatusChange is emitted
     */
    function tallyVotes() external onlyOwner statusIs(WorkflowStatus.VotingSessionEnded) {
        uint _bestVoteCount = 0;
        uint _winnersCount = 0;
        
        // use memory here to not write too many times in storage in the first loop below
        // not sure it's better because of static array size
        Proposal[] memory _winningProposals = new Proposal[](proposals.length);

        // we do not consider two first proposal elements (abstention and blank)
        for (uint i = 2; i < proposals.length; i++) {
            if (proposals[i].voteCount > _bestVoteCount) {
                _bestVoteCount = proposals[i].voteCount;
                _winnersCount = 1;
                _winningProposals[_winnersCount - 1] = proposals[i];
            } else if (proposals[i].voteCount == _bestVoteCount) {
                _winnersCount++;
                _winningProposals[_winnersCount - 1] = proposals[i];
            }
        }

        for (uint i = 0; i < _winnersCount; i++) {
            result.winningProposals.push(_winningProposals[i]);
        }

        status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    // ===============
    // only voter functions
    // ===============
    /**
     * Administrator or voter can register a new proposal.
     * 
     * @dev Each voter can register many proposals.
     * As the vote is considered to be done in small organization context, the maximum number of proposals is limited to 256.
     * Maximum number of proposals per voter is also limited to 3.
     * Votes can be added only by registered voter when `status` is set to VotingSessionStarted
     * 
     * @param _description The proposal description
     */
    function registerProposal(string memory _description) public onlyVoter statusIs(WorkflowStatus.ProposalsRegistrationStarted) {
        require(proposals.length < 2 ** 8 - 1, 'Too many proposals'); // limit total proposals count to 256
        require(voters[msg.sender].nbProposals < 3, 'You already posted 3 proposals which is the maximum allowed');
        proposals.push(Proposal(_description, 0, msg.sender));
        voters[msg.sender].nbProposals++;
        emit ProposalRegistered(uint8(proposals.length - 1));
    }

    /**
     * A voter can register his vote for a proposal.
     * 
     * @dev Each voter can vote only once for one proposal.
     * Votes can be added only by registered voter when `status` is set to VotingSessionStarted
     * 
     * @param _proposalId The identifier of the chosen proposal
     */
    function vote(uint8 _proposalId) external onlyVoter statusIs(WorkflowStatus.VotingSessionStarted) {
        require(!voters[msg.sender].hasVoted, 'Already voted');        
        proposals[_proposalId].voteCount++;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        result.totalVotes++;
        if (_proposalId == 1) {
            result.blankVotes++;
        }
        emit Voted(msg.sender, _proposalId);
    }

    // ===============
    // only owner or voter functions
    // ===============
    /**
     * Retreive voter information
     * 
     * @dev Administrator and registered voters can all access to everybody votes.
     * 
     * @return Target voter information including proposal choice
     */
    function getVoter(address voter) external view returns (Voter memory) {
        require(owner() == msg.sender || voters[msg.sender].isRegistered, 'Caller is not owner or registered voter');
        return voters[voter];
    }

}