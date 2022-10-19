import * as _ from 'lodash';

import { Observable } from 'rxjs';
import { Epic } from 'redux-observable';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { RootAction, RootState, Services } from 'rinkeby-types';
import { ProposalRegistered, SessionCreated, Voted, VoterRegistered, VotesTallied, WorkflowStatusChange } from 'rinkeby-voting-contracts/types/web3/contracts/Voting';

import { getVotingContract } from './contract';
import { CREATE_VOTING_SESSION, IVotingSessionListItem, LIST_VOTING_SESSIONS, LISTEN_VOTING_SESSION_CREATED, VOTING_SESSION_ADDED, LISTEN_VOTING_SESSION_STATUS_CHANGED, VOTING_SESSION_STATUS_CHANGED, FIND_VOTING_SESSION, NEXT_VOTING_SESSION_STEP, VotingSessionWorkflowStatus, LOAD_VOTING_CONTRACT_INFO, REGISTER_VOTER, LISTEN_VOTER_REGISTERED, LIST_VOTERS, VOTER_REGISTERED, IVotersMap, REGISTER_PROPOSAL, LIST_PROPOSALS, IProposal, LISTEN_PROPOSAL_REGISTERED, PROPOSAL_REGISTERED, VOTE, LIST_VOTES, LISTEN_VOTED, VOTED, IVote, TALLY_VOTES, LISTEN_VOTES_TALLIED, IVotesResult, VOTES_TALLIED, GET_VOTES_RESULT, IVotingSessionDetail } from './actions';
import { findRpcMessage } from 'src/eth-network/helpers';

export const loadVotingContractInfo: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LOAD_VOTING_CONTRACT_INFO.request)),
        mergeMap(async () => {  
            try {

                const accounts = await web3.eth.requestAccounts();
                const account = accounts[0];
                
                const contract = await getVotingContract(web3) as any;
                const owner = await contract.methods.owner().call();
                console.log('contract owner: ', owner)

                return LOAD_VOTING_CONTRACT_INFO.success({ 
                    contract,
                    isOwner: account === owner,
                    account,
                });
            } catch(e) {
                return LOAD_VOTING_CONTRACT_INFO.failure(findRpcMessage(e));
            }
        })
    );
};

export const listVotingSessions: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LIST_VOTING_SESSIONS.request)),
        mergeMap(async () => {
            try {    
                const sessions: IVotingSessionListItem[] = [];
                const contract = state$.value.voting.contract.info.contract;

                const events = await contract.getPastEvents('SessionCreated', { fromBlock: 0 });
                events.forEach((event) => {
                    const { returnValues } = event as unknown as SessionCreated;
                    sessions.push({
                        id: returnValues.sessionId,
                        name: returnValues.name,
                        description: returnValues.description,
                        $capabilities: {
                            $canChangeStatus: state$.value.voting.contract.info.isOwner,
                        },
                    });
                });
                console.log("=== sessions ===");
                console.table(sessions);
                return LIST_VOTING_SESSIONS.success(sessions);
            } catch(e) {
                return LIST_VOTING_SESSIONS.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listenVotingSessionCreated: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LISTEN_VOTING_SESSION_CREATED.request)),
        switchMap(() => {
            
            const contract = state$.value.voting.contract.info.contract;

            return new Observable<IVotingSessionListItem>((obs) => {                
                contract.events.SessionCreated()
                    .on('data', async (evt: SessionCreated) => {
                        const session: IVotingSessionListItem = {
                            id: evt.returnValues.sessionId,
                            name: evt.returnValues.name,
                            description: evt.returnValues.description,
                            $capabilities: {
                                $canChangeStatus: state$.value.voting.contract.info.isOwner,
                            },
                        };
                        console.log('=== Voting session created ===\n', JSON.stringify(session, null, 2));
                        obs.next(session);
                    });

                return () => (null);
            }).pipe(
                map((session) => {
                    return VOTING_SESSION_ADDED(session);
                }),
            );
        }),
    );
};

export const createVotingSession: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(CREATE_VOTING_SESSION.request)),
        mergeMap(async (action) => {

            try {
                const account = state$.value.ethNetwork.account;
                const contract = state$.value.voting.contract.info.contract;

                const { name, description } = action.payload;

                await contract.methods.createVotingSession(name, description).send({ from: account });
                return CREATE_VOTING_SESSION.success();
            } catch (e) {
                return CREATE_VOTING_SESSION.failure(findRpcMessage(e));
            }
        }),
        
    );
};

export const findVotingSession: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(FIND_VOTING_SESSION.request)),
        mergeMap(async (action) => {
            try {
                const sessionId = action.payload;

                const { contract, isOwner } = state$.value.voting.contract.info;

                const sessionCreatedEvents = await contract.getPastEvents('SessionCreated', { 
                    fromBlock: 0,
                    filter: { sessionId }
                });
                const data = _.last(sessionCreatedEvents)?.returnValues;

                const statusChangedEvents = await contract.getPastEvents('WorkflowStatusChange', { 
                    fromBlock: 0,
                    filter: { sessionId },
                });
                const status = +(_.last(statusChangedEvents)?.returnValues.newStatus || '0');
                const session: IVotingSessionDetail = {
                    id: data.sessionId,
                    name: data.name,
                    description: data.description,
                    status,
                    $capabilities: {
                        $canChangeStatus: isOwner && 
                            status < VotingSessionWorkflowStatus.VotesTallied,
                        $canRegisterVoter: isOwner && 
                            status === VotingSessionWorkflowStatus.RegisteringVoters,
                        $canRegisterProposal: !isOwner && 
                            status === VotingSessionWorkflowStatus.ProposalsRegistrationStarted,
                        $canVote: !isOwner && 
                            status === VotingSessionWorkflowStatus.VotingSessionStarted,
                    },
                };
                return FIND_VOTING_SESSION.success(session);
            } catch (e) {
                return FIND_VOTING_SESSION.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listenVotingSessionStatusChanged: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LISTEN_VOTING_SESSION_STATUS_CHANGED.request)),
        switchMap(() => {
            const contract = state$.value.voting.contract.info.contract;
            const sessionId = state$.value.voting.currentSession.item?.id;

            return new Observable<any>((obs) => {
                contract.events.WorkflowStatusChange({ filter: { sessionId } })
                    .on('data', async (evt: WorkflowStatusChange) => {
                        console.log('=== Voting session status changed ===\n', evt.returnValues.newStatus);
                        obs.next(+evt.returnValues.newStatus);
                    });

                return () => (null);
            }).pipe(
                map((status) => {
                    return VOTING_SESSION_STATUS_CHANGED(status);
                }),
            );
        }),
    );
};

export const nextVotingSessionStep: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(NEXT_VOTING_SESSION_STEP.request)),
        mergeMap(async (action) => {
            try {
                const account = state$.value.ethNetwork.account;
                const contract = state$.value.voting.contract.info.contract;

                const { sessionId, currentStatus} = action.payload;

                switch (currentStatus) {
                    case VotingSessionWorkflowStatus.RegisteringVoters:
                        await contract.methods.startProposalsRegistration(sessionId).send({ from: account });
                        break;
                    case VotingSessionWorkflowStatus.ProposalsRegistrationStarted:
                        await contract.methods.stopProposalsRegistration(sessionId).send({ from: account });
                        break;
                    case VotingSessionWorkflowStatus.ProposalsRegistrationEnded:
                        await contract.methods.startVotingSession(sessionId).send({ from: account });
                        break;
                    case VotingSessionWorkflowStatus.VotingSessionStarted:
                        await contract.methods.stopVotingSession(sessionId).send({ from: account });
                        break;
                    case VotingSessionWorkflowStatus.VotingSessionEnded:
                        await contract.methods.tallyVotes(sessionId).send({ from: account });
                        break;
                    default:
                        throw new Error('Invalid current voting session status');
                }
                return NEXT_VOTING_SESSION_STEP.success();
            } catch (e) {
                return NEXT_VOTING_SESSION_STEP.failure(findRpcMessage(e));
            }
        }),
    );
};

export const registerVoter: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(REGISTER_VOTER.request)),
        mergeMap(async (action) => {
            try {
                const account = state$.value.ethNetwork.account;
                const contract = state$.value.voting.contract.info.contract;
                
                const { sessionId, address } = action.payload;
                console.log("Register voter", sessionId)

                await contract.methods.registerVoter(sessionId, address).send({ from: account });
                return REGISTER_VOTER.success();
            } catch (e) {
                return REGISTER_VOTER.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listVoters: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LIST_VOTERS.request)),
        mergeMap(async () => {
            try {
                const voters: IVotersMap = {};
                const contract = state$.value.voting.contract.info.contract;

                const events = await contract.getPastEvents('VoterRegistered', { fromBlock: 0, filter: { sessionId: state$.value.voting.currentSession.item.id } });
                events.forEach((event) => {
                    const { returnValues } = event as unknown as VoterRegistered;
                    voters[returnValues.voterAddress] = {
                        hasVoted: false,
                        nbProposals: 0,
                    };
                });

                console.log('=== voters ===')
                console.table(voters)
                return LIST_VOTERS.success(voters);
            } catch (e) {
                return LIST_VOTERS.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listenVoterRegistered: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LISTEN_VOTER_REGISTERED.request)),
        switchMap(() => {
            
            const contract = state$.value.voting.contract.info.contract;
            const sessionId = state$.value.voting.currentSession.item.id;

            return new Observable<IVotersMap>((obs) => {                
                contract.events.VoterRegistered({ filter: { sessionId } })
                    .on('data', async (evt: VoterRegistered) => {
                        const voters: IVotersMap = {};
                        voters[evt.returnValues.voterAddress] = {
                            hasVoted: false,
                            nbProposals: 0,
                        };
                        console.log('=== Voter registered ===\n', evt.returnValues.voterAddress);
                        obs.next(voters);
                    });

                return () => (null);
            }).pipe(
                map((voter) => {
                    return VOTER_REGISTERED(voter);
                }),
            );
        }),
    );
};

export const registerProposal: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(REGISTER_PROPOSAL.request)),
        mergeMap(async (action) => {
            try {
                const account = state$.value.ethNetwork.account;
                const contract = state$.value.voting.contract.info.contract;

                const { sessionId, description } = action.payload;

                await contract.methods.registerProposal(sessionId, description).send({ from: account });
                return REGISTER_PROPOSAL.success();
                
            } catch (e) {
                return REGISTER_PROPOSAL.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listProposals: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LIST_PROPOSALS.request)),
        mergeMap(async () => {
            try {
                const proposals: IProposal[] = [];
                const contract = state$.value.voting.contract.info.contract;

                const events = await contract.getPastEvents('ProposalRegistered', { fromBlock: 0, filter: { sessionId: state$.value.voting.currentSession.item.id } });
                events.forEach((event) => {
                    const { returnValues } = event as unknown as ProposalRegistered;
                    proposals.push({
                        proposalId: returnValues.proposalId,
                        proposer: returnValues.proposer,
                        description: returnValues.description,
                    });
                });

                console.log('=== proposals ===')
                console.table(proposals)
                return LIST_PROPOSALS.success(proposals);
            } catch (e) {
                return LIST_PROPOSALS.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listenProposalRegistered: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LISTEN_PROPOSAL_REGISTERED.request)),
        switchMap(() => {
            
            const contract = state$.value.voting.contract.info.contract;
            const sessionId = state$.value.voting.currentSession.item.id;

            return new Observable<IProposal>((obs) => {                
                contract.events.ProposalRegistered({ filter: { sessionId } })
                    .on('data', async (evt: ProposalRegistered) => {
                        const proposal: IProposal = {
                            proposalId: evt.returnValues.proposalId,
                            proposer: evt.returnValues.proposer,
                            description: evt.returnValues.description,
                        };
                        console.log('=== Proposal registered ===\n', JSON.stringify(proposal, null, 2));
                        obs.next(proposal);
                    });

                return () => (null);
            }).pipe(
                map((proposal) => {
                    return PROPOSAL_REGISTERED(proposal);
                }),
            );
        }),
    );
};

export const vote: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(VOTE.request)),
        mergeMap(async (action) => {
            try {
                const account = state$.value.ethNetwork.account;
                const contract = state$.value.voting.contract.info.contract;

                const { sessionId, proposalId } = action.payload;

                await contract.methods.vote(sessionId, proposalId).send({ from: account });
                return VOTE.success();
            } catch (e) {
                return VOTE.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listVotes: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LIST_VOTES.request)),
        mergeMap(async () => {
            try {
                const votes: IVote[] = [];
                const contract = state$.value.voting.contract.info.contract;

                const events = await contract.getPastEvents('Voted', { fromBlock: 0, filter: { sessionId: state$.value.voting.currentSession.item.id } });
                events.forEach((event) => {
                    const { returnValues } = event as unknown as Voted;
                    votes.push({
                        voter: returnValues.voter,
                        proposalId: returnValues.proposalId,
                    });
                });
                console.log('=== votes ===')
                console.table(votes)
                return LIST_VOTES.success(votes);
            } catch (e) {
                return LIST_VOTES.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listenVoted: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LISTEN_VOTED.request)),
        switchMap(() => {
            
            const contract = state$.value.voting.contract.info.contract;
            const sessionId = state$.value.voting.currentSession.item.id;

            return new Observable<IVote>((obs) => {                
                contract.events.Voted({ filter: { sessionId } })
                    .on('data', async (evt: Voted) => {
                        const vote: IVote = {
                            voter: evt.returnValues.voter,
                            proposalId: evt.returnValues.proposalId,
                        };
                        console.log('Voted', vote);
                        obs.next(vote);
                    });

                return () => (null);
            }).pipe(
                map((vote) => {
                    return VOTED(vote);
                }),
            );
        }),
    );
};


export const tallyVotes: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(TALLY_VOTES.request)),
        mergeMap(async (action) => {
            try {
                const account = state$.value.ethNetwork.account;
                const contract = state$.value.voting.contract.info.contract;

                const sessionId = action.payload;

                await contract.methods.tallyVotes(sessionId).send({ from: account });
                return TALLY_VOTES.success();
            } catch (e) {
                return TALLY_VOTES.failure(findRpcMessage(e));
            }
        }),
    );
};

export const listenVotesTallied: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LISTEN_VOTES_TALLIED.request)),
        switchMap(() => {
            
            const contract = state$.value.voting.contract.info.contract;
            const sessionId = state$.value.voting.currentSession.item.id;

            return new Observable<IVotesResult>((obs) => {                
                contract.events.VotesTallied({ filter: { sessionId } })
                    .on('data', async (evt: VotesTallied) => {
                        console.log("evt.returnValues.winningProposals", evt.returnValues.winningProposals)
                        const result: IVotesResult = {
                            votersCount: +evt.returnValues.votersCount,
                            totalVotes: +evt.returnValues.totalVotes,
                            blankVotes: +evt.returnValues.blankVotes,
                            abstention: +evt.returnValues.abstention,
                            winningProposals: evt.returnValues.winningProposals.map(([description, voteCount, proposer]) => ({
                                description, 
                                voteCount: +voteCount, 
                                proposer
                            })),                        };
                        console.log('Votes result', result);
                        obs.next(result);
                    });

                return () => (null);
            }).pipe(
                map((result) => {
                    return VOTES_TALLIED(result);
                }),
            );
        }),
    );
};

export const getVotesResult: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(GET_VOTES_RESULT.request)),
        mergeMap(async () => {
            try {
                const contract = state$.value.voting.contract.info.contract;

                const events = await contract.getPastEvents('VotesTallied', { fromBlock: 0, filter: { sessionId: state$.value.voting.currentSession.item.id } });
                const firstEvent = events[0] as unknown as VotesTallied;
                
                let result: IVotesResult;
                if (firstEvent) {
                    result = {
                        abstention: +firstEvent.returnValues.abstention,
                        blankVotes: +firstEvent.returnValues.blankVotes,
                        totalVotes: +firstEvent.returnValues.totalVotes,
                        votersCount: +firstEvent.returnValues.votersCount,
                        winningProposals: firstEvent.returnValues.winningProposals.map(([description, voteCount, proposer]) => ({
                            description, 
                            voteCount: +voteCount, 
                            proposer
                        })),
                    }
                }
                console.log('=== Voting session result ===\n', JSON.stringify(result, null, 2))
                return GET_VOTES_RESULT.success(result);
            } catch (e) {
                return GET_VOTES_RESULT.failure(findRpcMessage(e));
            }
        }),
    );
};