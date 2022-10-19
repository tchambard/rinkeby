// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

/** 
 * @title Alyra Project: Voting system
 * @author Teddy Chambard
 * @notice This contract defines a basic voting system including different steps:
 * 1) voting session creation
 * 1) voters registration
 * 2) proposals registration
 * 3) votes recording
 * 4) votes talling
 * 
 * @dev Only the contract owner is able to create new voting session.
 * The contract owner is also able to change the session status and activate next session steps.
 * The word `Administrator` in contract documentation corresponds to contract owner.
 *
 * /!\ BONUS: I took some decisions to change initial specifications to improve the features available in the exercice:
 *
 * 1) Many voting sessions can be created and evolve in parallel
 * 2) Votes are kept secret until the end of session, then every votes become accessible to voters and contract owner
 * 3) Every events expose sessionId as first parameter
 * 4) `Voted` event does not expose chosen proposal ID in order to keep votes secret until the end of the session
 * 5) A session is limited to 256 proposals
 * 6) Two proposals are registered by default in every session: abstention and blank vote
 * 7) A voter can not do more than 3 proposals by session
 * 6) A voter can not vote for its own proposals
 * 7) A vote session can terminate with equality if many proposals obtain same number of votes
 */
contract Voting is Ownable {

    // ===============
    // types
    // ===============

    enum WorkflowStatus {
        None,
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

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
    
    struct Session {

        /**
         * @dev status is set to RegisteringVoters by createVotingSession function.
         * The inilial value `None` does not match with any expected status used with `isStatus` modifier.
         * Note: every functions are covered by `isStatus` modifier and that's why we can be sure a 
         * session exist when its status is different than None.
         */
        WorkflowStatus status;

        /**
         * !!! WARNING !!!
         * I decided to change a little the specifications to give more sense to the voting project:
         * 
         * Initial specifications were :
         * ✔️ Le vote n'est pas secret pour les utilisateurs ajoutés à la Whitelist
         * ✔️ Chaque électeur peut voir les votes des autres
         *
         * @dev In my implementation, voters mapping is never accessible from external so voter's choice (votedProposalId) 
         * is not known until `getVote` become available after end of voting session.
         * Informations like `isRegistered`, `hasVoted` or `nbProposals` are still available trough events.
         */
        mapping(address => Voter) voters;

        /**
         * @dev Voters count will be used to compute abstention
         */
        uint votersCount;

        /**
         * @dev Total votes count can be different than voters count and it will be used to compute abstention.
         */
        uint totalVotesCount;

        /**
         * @dev proposals are not available directly to protect `voteCount` information during voting process.
         * However, informations like `description` or `proposer` are still available trough events.
         */
        Proposal[] proposals;

        /**
         * winningProposals can be retrive after votes tallied with the function `getWinners`
         */
        Proposal[] winningProposals;
    }

    // ===============
    // events
    // ===============

    /**
     * !!! WARNING !!!
     * @dev All events signatures integrate sessionId parameter that was not required in specification
     */

    event SessionCreated(uint indexed sessionId, string name, string description);

    event VoterRegistered(uint indexed sessionId, address voterAddress);

    event WorkflowStatusChange(uint indexed sessionId, WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /**
     * !!! WARNING !!!
     * @dev I decided to add description into ProposalRegistered event in order to expose proposals during the voting session without the vote count.
     * By this way voters are able to retrieve proposal information but they can not access to each proposal vote count before the end ot the session.
     */
    event ProposalRegistered(uint indexed sessionId, uint8 proposalId, string description);

    /**
     * !!! WARNING !!!
     * @dev I decided to remove proposalId from Voted event despite the specification as 
     * I think no one should be able to see voters choice before the end of voting session
     */
    event Voted(uint indexed sessionId, address voter);

    event VotesTallied(uint indexed sessionId, uint votersCount, uint totalVotes, uint blankVotes, uint abstention, Proposal[] winningProposals);

    // ===============
    // storage
    // ===============

    mapping(uint => Session) private sessions;

    uint sessionsCount;

    // ===============
    // modifiers
    // ===============

    /**
     * @dev Throws if called when status is not the expected one.
     */
    modifier statusIs(uint _sessionId, WorkflowStatus _status) {
        require(sessions[_sessionId].status == _status, string.concat('Unexpected voting session status: expected=', 
            Strings.toString(uint(_status)), ' current=', Strings.toString(uint(sessions[_sessionId].status))));
        _;
    }    
    
    /**
     * @dev Throws if called when status is not at least the given status.
     */
    modifier statusAtLeast(uint _sessionId, WorkflowStatus _status) {
        require(sessions[_sessionId].status >= _status, string.concat('Unexpected voting session status: expected>=',
            Strings.toString(uint(_status)), ' current=', Strings.toString(uint(sessions[_sessionId].status))));
        _;
    }

    /**
     * @dev Throws if called by any account not registered as voter.
     */
    modifier onlyVoter(uint _sessionId) {
        require(sessions[_sessionId].voters[msg.sender].isRegistered, 'Caller is not registered voter');
        _;
    }

    /**
     * @dev Throws if called by any account not registered as voter or if it is not owner.
     */
    modifier onlyVoterOrOwner(uint _sessionId) {
        require(owner() == msg.sender || sessions[_sessionId].voters[msg.sender].isRegistered, 'Caller is not owner or registered voter');
        _;
    }

    // ===============
    // only owner functions
    // ===============

    /**
     * Administrator can create new voting session
     *
     * @param _name The session name 
     * @param _description The session description 
     */
    function createVotingSession(string calldata _name, string calldata _description) external onlyOwner {
        sessions[sessionsCount].status = WorkflowStatus.RegisteringVoters;
        emit SessionCreated(sessionsCount, _name, _description);
        emit WorkflowStatusChange(sessionsCount, WorkflowStatus.None, WorkflowStatus.RegisteringVoters);
        sessionsCount++;
    }

    /**
     * Administrator can register voters.
     * 
     * @dev voters can be added only by contract owner when status is set to RegisteringVoters
     * An event VoterRegistered is emitted
     * 
     * @param _sessionId The session identifier 
     * @param _voter The address to add into voters registry
     */
    function registerVoter(uint _sessionId, address _voter) external onlyOwner statusIs(_sessionId, WorkflowStatus.RegisteringVoters) {
        require(_voter != owner(), 'Owner can not be a voter');
        require(!sessions[_sessionId].voters[_voter].isRegistered, 'Voter is already registered');
        sessions[_sessionId].voters[_voter] = Voter(true, false, 0, 0);
        sessions[_sessionId].votersCount++;
        emit VoterRegistered(_sessionId, _voter);
    }

    /**
     * Administrator can close voters registration and open proposals registration.
     * 
     * @dev Can be called only when status is set to RegisteringVoters.
     * Two default proposals are registered at the beginning of this step: `Abstention` and `Blank`.
     * That means a registered voter that forget to vote will be counted as `abstention` thanks to `proposals` array index 0
     * An event WorkflowStatusChange is emitted
     *
     * @param _sessionId The session identifier 
     */
    function startProposalsRegistration(uint _sessionId) external onlyOwner statusIs(_sessionId, WorkflowStatus.RegisteringVoters) {
        _registerProposal(_sessionId, 'Abstention');
        _registerProposal(_sessionId, 'Blank');
        sessions[_sessionId].status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(_sessionId, WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * Administrator can close proposals registration.
     * 
     * @dev Can be called only when status is set to ProposalsRegistrationStarted.
     * An event WorkflowStatusChange is emitted
     *
     * @param _sessionId The session identifier 
     */
    function stopProposalsRegistration(uint _sessionId) external onlyOwner statusIs(_sessionId, WorkflowStatus.ProposalsRegistrationStarted) {
        sessions[_sessionId].status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(_sessionId, WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * Administrator can open voting session.
     * 
     * @dev Can be called only when status is set to ProposalsRegistrationEnded.
     * An event WorkflowStatusChange is emitted
     *
     * @param _sessionId The session identifier 
     */
    function startVotingSession(uint _sessionId) external onlyOwner statusIs(_sessionId, WorkflowStatus.ProposalsRegistrationEnded) {
        sessions[_sessionId].status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(_sessionId, WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * Administrator can close voting session.
     * 
     * @dev Can be called only when status is set to VotingSessionStarted.
     * An event WorkflowStatusChange is emitted
     *
     * @param _sessionId The session identifier 
     */
    function stopVotingSession(uint _sessionId) external onlyOwner statusIs(_sessionId, WorkflowStatus.VotingSessionStarted) {
        sessions[_sessionId].status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(_sessionId, WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * Administrator can trigger votes talling.
     * 
     * @dev After votes talling, it is possible that we got many winning proposals.
     * Votes talling can be triggered only by contract owner when voting session status is set to VotingSessionEnded
     * An event WorkflowStatusChange is emitted
     *
     * @param _sessionId The session identifier 
     */
    function tallyVotes(uint _sessionId) external onlyOwner statusIs(_sessionId, WorkflowStatus.VotingSessionEnded) {
        uint _bestVoteCount = 0;
        uint _winnersCount = 0;
        
        // use memory here to not write too many times in storage in the first loop below
        // not sure it's better because of static array size
        Proposal[] memory _winningProposals = new Proposal[](sessions[_sessionId].proposals.length);

        // we do not consider two first proposal elements (abstention and blank)
        for (uint i = 2; i < sessions[_sessionId].proposals.length; i++) {
            if (sessions[_sessionId].proposals[i].voteCount > _bestVoteCount) {
                _bestVoteCount = sessions[_sessionId].proposals[i].voteCount;
                _winnersCount = 1;
                _winningProposals[_winnersCount - 1] = sessions[_sessionId].proposals[i];
            } else if (sessions[_sessionId].proposals[i].voteCount > 0 && sessions[_sessionId].proposals[i].voteCount == _bestVoteCount) {
                _winnersCount++;
                _winningProposals[_winnersCount - 1] = sessions[_sessionId].proposals[i];
            }
        }

        for (uint i = 0; i < _winnersCount; i++) {
            sessions[_sessionId].winningProposals.push(_winningProposals[i]);
        }

        sessions[_sessionId].status = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(_sessionId, WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);

        uint abstention = sessions[_sessionId].votersCount > 0 ? sessions[_sessionId].votersCount - sessions[_sessionId].totalVotesCount : 0;
        emit VotesTallied(_sessionId, sessions[_sessionId].votersCount, sessions[_sessionId].totalVotesCount, sessions[_sessionId].proposals[1].voteCount, abstention, sessions[_sessionId].winningProposals);
    }

    // ===============
    // only voter functions
    // ===============

    /**
     * A voter can register a new proposal.
     * 
     * @dev Each voter can register many proposals.
     * As the vote is considered to be done in small organization context, the maximum number of proposals is limited to 256.
     * Maximum number of proposals per voter is also limited to 3.
     * A vote can be added only by registered voter when status is set to VotingSessionStarted
     * 
     * @param _sessionId The session identifier
     * @param _description The proposal description
     */
    function registerProposal(uint _sessionId, string calldata _description) public onlyVoter(_sessionId) statusIs(_sessionId, WorkflowStatus.ProposalsRegistrationStarted) {
        require(sessions[_sessionId].voters[msg.sender].nbProposals < 3, 'You already posted 3 proposals which is the maximum allowed');
        _registerProposal(_sessionId, _description);
    }

    /**
     * A voter can register his vote for a proposal.
     * 
     * @dev Each voter can vote only once for one proposal.
     * Votes can be added only by registered voter when status is set to VotingSessionStarted
     * 
     * @param _sessionId The session identifier
     * @param _proposalId The chosen proposal identifier
     */
    function vote(uint _sessionId, uint8 _proposalId) external onlyVoter(_sessionId) statusIs(_sessionId, WorkflowStatus.VotingSessionStarted) {
        require(!sessions[_sessionId].voters[msg.sender].hasVoted, 'Voter has already voted');
        require(_proposalId < sessions[_sessionId].proposals.length, string.concat('Proposal ', Strings.toString(_proposalId), ' does not exist'));
        require(sessions[_sessionId].proposals[_proposalId].proposer != msg.sender, 'A voter can not vote for its own proposal');
        require(_proposalId > 0, 'First proposal is reserved for abstention');

        sessions[_sessionId].proposals[_proposalId].voteCount++;
        sessions[_sessionId].voters[msg.sender].hasVoted = true;
        sessions[_sessionId].voters[msg.sender].votedProposalId = _proposalId;
        sessions[_sessionId].totalVotesCount++;
        
        emit Voted(_sessionId, msg.sender);
    }

    // ===============
    // only owner or voter functions
    // ===============

    /**
     * Retreive vote
     * 
     * @dev Administrator and registered voters can all access to everybody votes but only at the end of voting session.
     * 
     * @param _sessionId The session identifier
     * @param _voter The voter address
     * @return uint8 target voter proposal choice
     */    
    function getVote(uint _sessionId, address _voter) external view onlyVoterOrOwner(_sessionId) statusAtLeast(_sessionId, WorkflowStatus.VotingSessionEnded) returns (uint8) {
        return sessions[_sessionId].voters[_voter].votedProposalId;
    }

    /**
     * Retreive winning proposals
     * 
     * @dev Administrator and registered voters can retreive winning proposals but only at the end of voting session.
     * 
     * @return Proposal[] The winning proposals
     */    
    function getWinners(uint _sessionId) external view onlyVoterOrOwner(_sessionId) statusAtLeast(_sessionId, WorkflowStatus.VotesTallied) returns (Proposal[] memory) {
        return sessions[_sessionId].winningProposals;
    }

    // ===============
    // private functions
    // ===============
    function _registerProposal(uint _sessionId, string memory _description) private {
        require(sessions[_sessionId].proposals.length < 2 ** 8 - 1, 'Too many proposals'); // limit total proposals count to 256
        sessions[_sessionId].proposals.push(Proposal(_description, 0, msg.sender));
        sessions[_sessionId].voters[msg.sender].nbProposals++;
        uint8 proposalId = uint8(sessions[_sessionId].proposals.length - 1);
        emit ProposalRegistered(_sessionId, proposalId, sessions[_sessionId].proposals[proposalId].description);
    }
}