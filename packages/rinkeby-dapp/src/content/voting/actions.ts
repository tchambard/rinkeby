import { createAction, createAsyncAction } from 'typesafe-actions';
import { contracts } from 'rinkeby-voting-contracts';

export interface IVotingContractInfo {
    contract: contracts.Voting;
    isOwner: boolean;
    account: string;
}

export interface ICreateVotingSessionParams {
    name: string;
    description: string;
}

export interface IDeleteVotingSessionParams {
    sessionId: string;
}

export interface INextVotingSessionStepParams {
    sessionId: string;
    currentStatus: VotingSessionWorkflowStatus;
}

export interface IRegisterVoterParams {
    sessionId: string;
    address: string;
}

export interface IRegisterProposalParams {
    sessionId: string;
    description: string;
}

export interface IVotingSessionListCapabilities {
    $canCreate?: boolean;
}

export interface IVotingSessionDetailCapabilities {
    $canDelete?: boolean;
    $canChangeStatus?: boolean;
    $canRegisterVoter?: boolean;
    $canRegisterProposal?: boolean;
    $canVote?: boolean;
}

export interface IVotingSessionListItem {
    id: string;
    name: string;
    description: string;
    $capabilities: IVotingSessionDetailCapabilities;
}


export enum VotingSessionWorkflowStatus {
    None,
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
}

export interface IVotingSessionDetail {
    id: string;
    name: string;
    description: string;
    status?: VotingSessionWorkflowStatus;
    $capabilities: IVotingSessionDetailCapabilities;
}

export interface IVoter {
    hasVoted: boolean;
    nbProposals: number;
    votedProposalId?: string;
}

export interface IVotersMap { 
    [address: string] : IVoter;
}

export interface IProposal {
    proposalId: string;
    proposer: string;
    description: string;
    voteCount?: number;
}

export interface IVoteParams {
    sessionId: string;
    proposalId: string;
}
export interface IVote {
    voter: string;
    proposalId: string;
}

export interface IVotesResult {
    votersCount: number; 
    totalVotes: number;
    blankVotes: number; 
    abstention: number; 
    winningProposals: { description: string; voteCount: number; proposer: string }[];
}

export const MAX_PROPOSALS = 3;

export const LOAD_VOTING_CONTRACT_INFO = createAsyncAction(
    'LOAD_VOTING_CONTRACT_INFO_REQUEST',
    'LOAD_VOTING_CONTRACT_INFO_SUCCESS',
    'LOAD_VOTING_CONTRACT_INFO_FAILURE',
)<void, IVotingContractInfo, string>();

export const LIST_VOTING_SESSIONS = createAsyncAction(
    'LIST_VOTING_SESSIONS_REQUEST',
    'LIST_VOTING_SESSIONS_SUCCESS',
    'LIST_VOTING_SESSIONS_FAILURE',
)<void, IVotingSessionListItem[], string>();

export const LISTEN_VOTING_SESSION_CREATED = createAsyncAction(
    'LISTEN_VOTING_SESSION_CREATED_REQUEST',
    'LISTEN_VOTING_SESSION_CREATED_SUCCESS',
    'LISTEN_VOTING_SESSION_CREATED_FAILURE',
)<void, string, string>();

export const VOTING_SESSION_ADDED = createAction('VOTING_SESSION_ADDED', (action) => {
    return (session: IVotingSessionListItem) => action(session);
});

export const CREATE_VOTING_SESSION = createAsyncAction(
    'CREATE_VOTING_SESSION_REQUEST',
    'CREATE_VOTING_SESSION_SUCCESS',
    'CREATE_VOTING_SESSION_FAILURE',
)<ICreateVotingSessionParams, void, string>();

export const DELETE_VOTING_SESSION = createAsyncAction(
    'DELETE_VOTING_SESSION_REQUEST',
    'DELETE_VOTING_SESSION_SUCCESS',
    'DELETE_VOTING_SESSION_FAILURE',
)<IDeleteVotingSessionParams, void, string>();

export const FIND_VOTING_SESSION = createAsyncAction(
    'FIND_VOTING_SESSION_REQUEST',
    'FIND_VOTING_SESSION_SUCCESS',
    'FIND_VOTING_SESSION_FAILURE',
)<string, IVotingSessionDetail, string>();

export const GET_VOTING_SESSION_STATUS = createAsyncAction(
    'GET_VOTING_SESSION_STATUS_REQUEST',
    'GET_VOTING_SESSION_STATUS_SUCCESS',
    'GET_VOTING_SESSION_STATUS_FAILURE',
)<string, number, string>();

export const LISTEN_VOTING_SESSION_STATUS_CHANGED = createAsyncAction(
    'LISTEN_VOTING_SESSION_STATUS_CHANGED_REQUEST',
    'LISTEN_VOTING_SESSION_STATUS_CHANGED_SUCCESS',
    'LISTEN_VOTING_SESSION_STATUS_CHANGED_FAILURE',
)<string, void, string>();

export const VOTING_SESSION_STATUS_CHANGED = createAction('VOTING_SESSION_STATUS_CHANGED', (action) => {
    return (status: VotingSessionWorkflowStatus) => action(status);
});

export const NEXT_VOTING_SESSION_STEP = createAsyncAction(
    'NEXT_VOTING_SESSION_STEP_REQUEST',
    'NEXT_VOTING_SESSION_STEP_SUCCESS',
    'NEXT_VOTING_SESSION_STEP_FAILURE',
)<INextVotingSessionStepParams, void, string>();

export const REGISTER_VOTER = createAsyncAction(
    'REGISTER_VOTER_REQUEST',
    'REGISTER_VOTER_SUCCESS',
    'REGISTER_VOTER_FAILURE',
)<IRegisterVoterParams, void, string>();

export const LIST_VOTERS = createAsyncAction(
    'LIST_VOTERS_REQUEST',
    'LIST_VOTERS_SUCCESS',
    'LIST_VOTERS_FAILURE',
)<string, IVotersMap, string>();

export const LISTEN_VOTER_REGISTERED = createAsyncAction(
    'LISTEN_VOTER_REGISTERED_REQUEST',
    'LISTEN_VOTER_REGISTERED_SUCCESS',
    'LISTEN_VOTER_REGISTERED_FAILURE',
)<string, IVotersMap, string>();

export const VOTER_REGISTERED = createAction('VOTER_REGISTERED', (action) => {
    return (voter: IVotersMap) => action(voter);
});

export const REGISTER_PROPOSAL = createAsyncAction(
    'REGISTER_PROPOSAL_REQUEST',
    'REGISTER_PROPOSAL_SUCCESS',
    'REGISTER_PROPOSAL_FAILURE',
)<IRegisterProposalParams, void, string>();

export const LIST_PROPOSALS = createAsyncAction(
    'LIST_PROPOSALS_REQUEST',
    'LIST_PROPOSALS_SUCCESS',
    'LIST_PROPOSALS_FAILURE',
)<string, IProposal[], string>();

export const LISTEN_PROPOSAL_REGISTERED = createAsyncAction(
    'LISTEN_PROPOSAL_REGISTERED_REQUEST',
    'LISTEN_PROPOSAL_REGISTERED_SUCCESS',
    'LISTEN_PROPOSAL_REGISTERED_FAILURE',
)<string, void, string>();

export const PROPOSAL_REGISTERED = createAction('PROPOSAL_REGISTERED', (action) => {
    return (proposal: IProposal) => action(proposal);
});

export const VOTE = createAsyncAction(
    'VOTE_REQUEST',
    'VOTE_SUCCESS',
    'VOTE_FAILURE',
)<IVoteParams, void, string>();

export const LIST_VOTES = createAsyncAction(
    'LIST_VOTES_REQUEST',
    'LIST_VOTES_SUCCESS',
    'LIST_VOTES_FAILURE',
)<string, IVote[], string>();

export const LISTEN_VOTED = createAsyncAction(
    'LISTEN_VOTED_REQUEST',
    'LISTEN_VOTED_SUCCESS',
    'LISTEN_VOTED_FAILURE',
)<string, void, string>();

export const VOTED = createAction('VOTED', (action) => {
    return (vote: IVote) => action(vote);
});

export const TALLY_VOTES = createAsyncAction(
    'TALLY_VOTES_REQUEST',
    'TALLY_VOTES_SUCCESS',
    'TALLY_VOTES_FAILURE',
)<string, void, string>();

export const GET_VOTES_RESULT = createAsyncAction(
    'GET_VOTES_RESULT_REQUEST',
    'GET_VOTES_RESULT_SUCCESS',
    'GET_VOTES_RESULT_FAILURE',
)<string, IVotesResult | undefined, string>();

export const LISTEN_VOTES_TALLIED = createAsyncAction(
    'LISTEN_VOTES_TALLIED_REQUEST',
    'LISTEN_VOTES_TALLIED_SUCCESS',
    'LISTEN_VOTES_TALLIED_FAILURE',
)<string, void, string>();

export const VOTES_TALLIED = createAction('VOTES_TALLIED', (action) => {
    return (result: IVotesResult) => action(result);
});

export const CLEAR_CREATE_VOTING_SESSION_TX_ERROR = createAction('CLEAR_CREATE_VOTING_SESSION_TX_ERROR', (action) => {
    return () => action();
});
