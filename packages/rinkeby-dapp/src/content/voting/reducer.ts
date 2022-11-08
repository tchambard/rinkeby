import * as _ from 'lodash';
import { SET_CURRENT_ACCOUNT } from 'src/eth-network/actions';
import { ActionType, createReducer } from 'typesafe-actions';

import {
	CLEAR_CREATE_VOTING_SESSION_TX_ERROR,
	CREATE_VOTING_SESSION,
	FIND_VOTING_SESSION,
	GET_VOTES_RESULT,
	IProposal,
	IVoter,
	IVotesResult,
	IVotingContractInfo,
	IVotingSessionDetail,
	IVotingSessionListCapabilities,
	IVotingSessionListItem,
	LIST_PROPOSALS,
	LIST_VOTERS,
	LIST_VOTES,
	LIST_VOTING_SESSIONS,
	LOAD_VOTING_CONTRACT_INFO,
	MAX_PROPOSALS,
	NEXT_VOTING_SESSION_STEP,
	PROPOSAL_REGISTERED,
	REGISTER_PROPOSAL,
	REGISTER_VOTER,
	TALLY_VOTES,
	VOTE,
	VOTED,
	VOTER_REGISTERED,
	VOTES_TALLIED,
	VotingSessionWorkflowStatus,
	VOTING_SESSION_ADDED,
	VOTING_SESSION_STATUS_CHANGED,
} from './actions';

export interface IVotingState {
	contract: { info?: IVotingContractInfo; loading: boolean };
	sessions: {
		items: IVotingSessionListItem[];
		$capabilities: IVotingSessionListCapabilities;
		loading: boolean;
	};
	currentSession: { item?: IVotingSessionDetail; loading: boolean };
	voters: { items: { [address: string]: IVoter }; loading: boolean };
	proposals: { items: IProposal[]; loading: boolean };
	result: { data?: IVotesResult; loading: boolean };
	txPending: boolean;
	error?: string;
}

const initialState: IVotingState = {
	contract: { loading: false },
	sessions: { items: [], $capabilities: {}, loading: false },
	currentSession: { loading: false },
	voters: { items: {}, loading: false },
	proposals: { items: [], loading: false },
	result: { loading: false },
	txPending: false,
};

export default createReducer(initialState)
	.handleAction(
		[LOAD_VOTING_CONTRACT_INFO.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				contract: {
					info: undefined,
					loading: true,
				},
			};
		},
	)

	.handleAction(
		[LOAD_VOTING_CONTRACT_INFO.failure],
		(
			state: IVotingState,
			action: ActionType<typeof LOAD_VOTING_CONTRACT_INFO.failure>,
		): IVotingState => {
			return {
				...state,
				contract: {
					...state.contract,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LOAD_VOTING_CONTRACT_INFO.success],
		(
			state: IVotingState,
			action: ActionType<typeof LOAD_VOTING_CONTRACT_INFO.success>,
		): IVotingState => {
			return {
				...state,
				contract: {
					info: action.payload,
					loading: false,
				},
			};
		},
	)

	.handleAction(
		[LIST_VOTING_SESSIONS.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				sessions: {
					items: [],
					loading: true,
					$capabilities: {},
				},
			};
		},
	)

	.handleAction(
		[LIST_VOTING_SESSIONS.failure],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_VOTING_SESSIONS.failure>,
		): IVotingState => {
			return {
				...state,
				sessions: {
					...state.sessions,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LIST_VOTING_SESSIONS.success],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_VOTING_SESSIONS.success>,
		): IVotingState => {
			return {
				...state,
				sessions: {
					items: action.payload || [],
					loading: false,
					$capabilities: {
						$canCreate: state.contract.info?.isOwner,
					},
				},
			};
		},
	)

	.handleAction(
		[VOTING_SESSION_ADDED],
		(
			state: IVotingState,
			action: ActionType<typeof VOTING_SESSION_ADDED>,
		): IVotingState => {
			return {
				...state,
				sessions: {
					...state.sessions,
					items: [...state.sessions.items, action.payload],
				},
			};
		},
	)

	.handleAction(
		[CREATE_VOTING_SESSION.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: true,
			};
		},
	)

	.handleAction(
		[CREATE_VOTING_SESSION.failure],
		(
			state: IVotingState,
			action: ActionType<typeof CREATE_VOTING_SESSION.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction(
		[CREATE_VOTING_SESSION.success],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: false,
			};
		},
	)

	.handleAction(
		[NEXT_VOTING_SESSION_STEP.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: true,
			};
		},
	)

	.handleAction(
		[NEXT_VOTING_SESSION_STEP.failure],
		(
			state: IVotingState,
			action: ActionType<typeof NEXT_VOTING_SESSION_STEP.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction(
		[NEXT_VOTING_SESSION_STEP.success],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: false,
			};
		},
	)

	.handleAction(
		[FIND_VOTING_SESSION.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				currentSession: {
					item: undefined,
					loading: true,
				},
			};
		},
	)

	.handleAction(
		[FIND_VOTING_SESSION.failure],
		(
			state: IVotingState,
			action: ActionType<typeof FIND_VOTING_SESSION.failure>,
		): IVotingState => {
			return {
				...state,
				currentSession: {
					...state.currentSession,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[FIND_VOTING_SESSION.success],
		(
			state: IVotingState,
			action: ActionType<typeof FIND_VOTING_SESSION.success>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				currentSession: {
					item: action.payload,
					loading: false,
				},
			};
		},
	)

	.handleAction(
		[VOTING_SESSION_STATUS_CHANGED],
		(
			state: IVotingState,
			action: ActionType<typeof VOTING_SESSION_STATUS_CHANGED>,
		): IVotingState => {
			return {
				...state,
				currentSession: {
					...state.currentSession,
					item: {
						...state.currentSession.item,
						status: action.payload,
						$capabilities: {
							$canChangeStatus:
								state.contract.info.isOwner &&
								action.payload < VotingSessionWorkflowStatus.VotesTallied,
							$canRegisterVoter:
								state.contract.info.isOwner &&
								action.payload ===
									VotingSessionWorkflowStatus.RegisteringVoters,
							$canRegisterProposal:
								!state.contract.info.isOwner &&
								state.voters.items?.[state.contract.info.account] &&
								action.payload ===
									VotingSessionWorkflowStatus.ProposalsRegistrationStarted,
							$canVote:
								!state.contract.info.isOwner &&
								state.voters.items?.[state.contract.info.account] &&
								action.payload ===
									VotingSessionWorkflowStatus.VotingSessionStarted,
						},
					},
				},
			};
		},
	)

	.handleAction([LIST_VOTERS.request], (state: IVotingState): IVotingState => {
		return {
			...state,
			voters: {
				items: {},
				loading: true,
			},
		};
	})

	.handleAction(
		[LIST_VOTERS.failure],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_VOTERS.failure>,
		): IVotingState => {
			return {
				...state,
				voters: {
					...state.voters,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LIST_VOTERS.success],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_VOTERS.success>,
		): IVotingState => {
			const voters = action.payload;
			return {
				...state,
				voters: {
					items: voters || {},
					loading: false,
				},
			};
		},
	)

	.handleAction(
		[REGISTER_VOTER.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: true,
			};
		},
	)

	.handleAction(
		[REGISTER_VOTER.failure],
		(
			state: IVotingState,
			action: ActionType<typeof REGISTER_VOTER.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction(
		[REGISTER_VOTER.success],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: false,
			};
		},
	)

	.handleAction(
		[VOTER_REGISTERED],
		(
			state: IVotingState,
			action: ActionType<typeof VOTER_REGISTERED>,
		): IVotingState => {
			return {
				...state,
				voters: {
					...state.voters,
					items: {
						...state.voters.items,
						...action.payload,
					},
				},
			};
		},
	)

	.handleAction(
		[LIST_PROPOSALS.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				proposals: {
					items: [],
					loading: true,
				},
			};
		},
	)

	.handleAction(
		[LIST_PROPOSALS.failure],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_PROPOSALS.failure>,
		): IVotingState => {
			return {
				...state,
				proposals: {
					...state.proposals,
					loading: false,
				},
				error: action.payload,
			};
		},
	)

	.handleAction(
		[LIST_PROPOSALS.success],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_PROPOSALS.success>,
		): IVotingState => {
			const voters = state.voters.items;
			const proposals = action.payload;
			proposals.forEach((p) => {
				voters[p.proposer] && voters[p.proposer].nbProposals++;
			});
			return {
				...state,
				proposals: {
					items: proposals || [],
					loading: false,
				},
				voters: {
					...state.voters,
					items: voters,
				},
				currentSession: {
					...state.currentSession,
					item: {
						...state.currentSession.item,
						$capabilities: {
							...state.currentSession.item.$capabilities,
							$canRegisterProposal:
								state.currentSession.item.$capabilities.$canRegisterProposal &&
								voters?.[state.contract.info.account] &&
								voters[state.contract.info.account].nbProposals < MAX_PROPOSALS,
						},
					},
				},
			};
		},
	)

	.handleAction(
		[REGISTER_PROPOSAL.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: true,
			};
		},
	)

	.handleAction(
		[REGISTER_PROPOSAL.failure],
		(
			state: IVotingState,
			action: ActionType<typeof REGISTER_PROPOSAL.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction(
		[REGISTER_PROPOSAL.success],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: false,
			};
		},
	)

	.handleAction(
		[PROPOSAL_REGISTERED],
		(
			state: IVotingState,
			action: ActionType<typeof PROPOSAL_REGISTERED>,
		): IVotingState => {
			return {
				...state,
				proposals: {
					...state.proposals,
					items: [...state.proposals.items, action.payload],
				},
				voters: {
					...state.voters,
					items: {
						...state.voters.items,
						[action.payload.proposer]: {
							...state.voters.items[action.payload.proposer],
							nbProposals:
								state.voters.items[action.payload.proposer].nbProposals + 1,
						},
					},
				},
				currentSession: {
					...state.currentSession,
					item: {
						...state.currentSession.item,
						$capabilities: {
							...state.currentSession.item.$capabilities,
							$canRegisterProposal:
								state.currentSession.item.$capabilities.$canRegisterProposal &&
								state.voters.items[state.contract.info.account] &&
								state.voters.items[state.contract.info.account].nbProposals <
									MAX_PROPOSALS,
						},
					},
				},
			};
		},
	)

	.handleAction(
		[LIST_VOTES.success],
		(
			state: IVotingState,
			action: ActionType<typeof LIST_VOTES.success>,
		): IVotingState => {
			const updatedVoters: { [address: string]: IVoter } = _.reduce(
				action.payload,
				(acc, vote) => {
					acc[vote.voter] = {
						...state.voters.items[vote.voter],
						hasVoted: true,
						votedProposalId: vote.proposalId,
					};

					return acc;
				},
				state.voters.items,
			);

			return {
				...state,
				currentSession: {
					...state.currentSession,
					item: {
						...state.currentSession.item,
						$capabilities: {
							...state.currentSession.item.$capabilities,
							$canVote:
								state.currentSession.item.$capabilities.$canVote &&
								state.voters.items?.[state.contract.info.account] &&
								!updatedVoters[state.contract.info.account]?.hasVoted,
						},
					},
				},
				proposals: {
					...state.proposals,
					items: state.proposals.items.map((p) => {
						if (
							_.find(action.payload, (_p) => _p.proposalId === p.proposalId)
						) {
							p.voteCount = (p.voteCount || 0) + 1;
						}
						return p;
					}),
				},
				voters: {
					...state.voters,
					items: updatedVoters,
				},
			};
		},
	)

	.handleAction([VOTE.request], (state: IVotingState): IVotingState => {
		return {
			...state,
			txPending: true,
		};
	})

	.handleAction(
		[VOTE.failure],
		(
			state: IVotingState,
			action: ActionType<typeof VOTE.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction([VOTE.success], (state: IVotingState): IVotingState => {
		return {
			...state,
			txPending: false,
		};
	})

	.handleAction(
		[VOTED],
		(state: IVotingState, action: ActionType<typeof VOTED>): IVotingState => {
			const updatedVoters: { [address: string]: IVoter } = {
				...state.voters.items,
				[action.payload.voter]: {
					...state.voters.items[action.payload.voter],
					hasVoted: true,
					votedProposalId: action.payload.proposalId,
				},
			};
			return {
				...state,
				currentSession: {
					...state.currentSession,
					item: {
						...state.currentSession.item,
						$capabilities: {
							...state.currentSession.item.$capabilities,
							$canVote:
								state.currentSession.item.$capabilities.$canVote &&
								state.voters.items?.[state.contract.info.account] &&
								!updatedVoters[state.contract.info.account]?.hasVoted,
						},
					},
				},
				proposals: {
					...state.proposals,
					items: state.proposals.items.map((p) => {
						if (p.proposalId === action.payload.proposalId) {
							p.voteCount = (p.voteCount || 0) + 1;
						}
						return p;
					}),
				},
				voters: {
					...state.voters,
					items: updatedVoters,
				},
			};
		},
	)

	.handleAction([TALLY_VOTES.request], (state: IVotingState): IVotingState => {
		return {
			...state,
			txPending: true,
		};
	})

	.handleAction(
		[TALLY_VOTES.failure],
		(
			state: IVotingState,
			action: ActionType<typeof TALLY_VOTES.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction([TALLY_VOTES.success], (state: IVotingState): IVotingState => {
		return {
			...state,
			txPending: false,
		};
	})

	.handleAction(
		[GET_VOTES_RESULT.request],
		(state: IVotingState): IVotingState => {
			return {
				...state,
				txPending: true,
			};
		},
	)

	.handleAction(
		[GET_VOTES_RESULT.failure],
		(
			state: IVotingState,
			action: ActionType<typeof GET_VOTES_RESULT.failure>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				error: action.payload,
			};
		},
	)

	.handleAction(
		[GET_VOTES_RESULT.success],
		(
			state: IVotingState,
			action: ActionType<typeof GET_VOTES_RESULT.success>,
		): IVotingState => {
			return {
				...state,
				txPending: false,
				result: {
					...state.result,
					data: action.payload,
				},
			};
		},
	)

	.handleAction(
		[VOTES_TALLIED],
		(
			state: IVotingState,
			action: ActionType<typeof VOTES_TALLIED>,
		): IVotingState => {
			return {
				...state,
				result: {
					...state.result,
					data: action.payload,
				},
			};
		},
	)

	.handleAction(
		[CLEAR_CREATE_VOTING_SESSION_TX_ERROR],
		(
			state: IVotingState,
			action: ActionType<typeof CLEAR_CREATE_VOTING_SESSION_TX_ERROR>,
		): IVotingState => {
			return {
				...state,
				error: undefined,
			};
		},
	)

	.handleAction(
		[SET_CURRENT_ACCOUNT],
		(
			state: IVotingState,
			action: ActionType<typeof SET_CURRENT_ACCOUNT>,
		): IVotingState => {
			// reset state will force reload of data
			return initialState;
		},
	);
