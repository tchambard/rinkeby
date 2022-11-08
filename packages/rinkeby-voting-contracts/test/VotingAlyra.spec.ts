import { assert } from 'chai';
import { BN, expectEvent, expectRevert } from '@openzeppelin/test-helpers';

import { VotingAlyraInstance } from '../types/truffle/contracts/VotingAlyra';

const VotingAlyra = artifacts.require('VotingAlyra');

const mapProposalRegisteredEvent = ({ returnValues }) =>
	+returnValues.proposalId;

const mapVoterRegisteredEvent = ({ returnValues }) => returnValues.voterAddress;

const mapVotedEvent = ({ returnValues }) => ({
	voter: returnValues.voter,
	proposalId: +returnValues.proposalId,
});

contract('VotingAlyra', (accounts) => {
	const administrator = accounts[0];
	const batman = accounts[1];
	const superman = accounts[2];
	const wonderwoman = accounts[3];

	let votingInstance: VotingAlyraInstance;

	describe('> onlyOwner modifer prevents functions to be called by non owners', () => {
		beforeEach(async () => {
			votingInstance = await VotingAlyra.new({ from: administrator });
			await votingInstance.addVoter(batman, { from: administrator });
		});

		describe('> addVoter', () => {
			it('> should fail when called with registered voter address', async () => {
				await expectRevert(
					votingInstance.addVoter(superman, { from: batman }),
					'Ownable: caller is not the owner',
				);
			});

			it('> should fail when called with non registered voter address', async () => {
				await expectRevert(
					votingInstance.addVoter(superman, { from: superman }),
					'Ownable: caller is not the owner',
				);
			});
		});

		describe('> startProposalsRegistering', () => {
			it('> should fail when called with registered voter address', async () => {
				await expectRevert(
					votingInstance.startProposalsRegistering({ from: batman }),
					'Ownable: caller is not the owner',
				);
			});

			it('> should fail when called with non registered voter address', async () => {
				await expectRevert(
					votingInstance.startProposalsRegistering({ from: superman }),
					'Ownable: caller is not the owner',
				);
			});
		});

		describe('> endProposalsRegistering', () => {
			it('> should fail when called with registered voter address', async () => {
				await expectRevert(
					votingInstance.endProposalsRegistering({ from: batman }),
					'Ownable: caller is not the owner',
				);
			});

			it('> should fail when called with non registered voter address', async () => {
				await expectRevert(
					votingInstance.endProposalsRegistering({ from: superman }),
					'Ownable: caller is not the owner',
				);
			});
		});

		describe('> startVotingSession', () => {
			it('> should fail when called with registered voter address', async () => {
				await expectRevert(
					votingInstance.startVotingSession({ from: batman }),
					'Ownable: caller is not the owner',
				);
			});

			it('> should fail when called with non registered voter address', async () => {
				await expectRevert(
					votingInstance.startVotingSession({ from: superman }),
					'Ownable: caller is not the owner',
				);
			});
		});

		describe('> endVotingSession', () => {
			it('> should fail when called with registered voter address', async () => {
				await expectRevert(
					votingInstance.endVotingSession({ from: batman }),
					'Ownable: caller is not the owner',
				);
			});

			it('> should fail when called with non registered voter address', async () => {
				await expectRevert(
					votingInstance.endVotingSession({ from: superman }),
					'Ownable: caller is not the owner',
				);
			});
		});

		describe('> tallyVotes', () => {
			it('> should fail when called with registered voter address', async () => {
				await expectRevert(
					votingInstance.tallyVotes({ from: batman }),
					'Ownable: caller is not the owner',
				);
			});

			it('> should fail when called with non registered voter address', async () => {
				await expectRevert(
					votingInstance.tallyVotes({ from: superman }),
					'Ownable: caller is not the owner',
				);
			});
		});
	});

	describe('> onlyVoters modifier prevents functions to be called by non voters', () => {
		beforeEach(async () => {
			votingInstance = await VotingAlyra.new({ from: administrator });
			await votingInstance.addVoter(batman, { from: administrator });
		});

		describe('> getVoter', () => {
			it('> should fail when called with non registered voter', async () => {
				await expectRevert(
					votingInstance.getVoter(batman, { from: superman }),
					`You're not a voter`,
				);
			});

			it('> should fail when called with contrat owner address', async () => {
				await expectRevert(
					votingInstance.getVoter(batman, { from: administrator }),
					`You're not a voter`,
				);
			});
		});

		describe('> getOneProposal', () => {
			it('> should fail when called with non registered voter', async () => {
				await expectRevert(
					votingInstance.getOneProposal(0, { from: superman }),
					`You're not a voter`,
				);
			});

			it('> should fail when called with contrat owner address', async () => {
				await expectRevert(
					votingInstance.getOneProposal(0, { from: administrator }),
					`You're not a voter`,
				);
			});
		});

		describe('> addProposal', () => {
			it('> should fail when called with non registered voter', async () => {
				await expectRevert(
					votingInstance.addProposal('fake proposal', { from: superman }),
					`You're not a voter`,
				);
			});

			it('> should fail when called with contrat owner address', async () => {
				await expectRevert(
					votingInstance.addProposal('fake proposal', { from: administrator }),
					`You're not a voter`,
				);
			});
		});

		describe('> setVote', () => {
			it('> should fail when called with non registered voter', async () => {
				await expectRevert(
					votingInstance.setVote(0, { from: superman }),
					`You're not a voter`,
				);
			});

			it('> should fail when called with contrat owner address', async () => {
				await expectRevert(
					votingInstance.setVote(0, { from: administrator }),
					`You're not a voter`,
				);
			});
		});
	});

	describe('> everybody can call public storage getters', () => {
		beforeEach(async () => {
			votingInstance = await VotingAlyra.new({ from: administrator });
			await votingInstance.addVoter(batman, { from: administrator });
		});

		describe('> winningProposalID', () => {
			it('> should succeed when called with non registered voter', async () => {
				assert.equal(
					(
						await votingInstance.winningProposalID({ from: superman })
					).toNumber(),
					0,
				);
			});

			it('> should succeed when called with registered voter', async () => {
				assert.equal(
					(await votingInstance.winningProposalID({ from: batman })).toNumber(),
					0,
				);
			});

			it('> should succeed when called with contrat owner address', async () => {
				assert.equal(
					(
						await votingInstance.winningProposalID({ from: administrator })
					).toNumber(),
					0,
				);
			});
		});

		describe('> workflowStatus', () => {
			it('> should succeed when called with non registered voter', async () => {
				assert.equal(
					(await votingInstance.workflowStatus({ from: superman })).toNumber(),
					0,
				);
			});

			it('> should succeed when called with registered voter', async () => {
				assert.equal(
					(await votingInstance.workflowStatus({ from: batman })).toNumber(),
					0,
				);
			});

			it('> should succeed when called with contrat owner address', async () => {
				assert.equal(
					(
						await votingInstance.workflowStatus({ from: administrator })
					).toNumber(),
					0,
				);
			});
		});
	});

	describe('> Voting actions are conditionned by voting session status', () => {
		beforeEach(async () => {
			votingInstance = await VotingAlyra.new({ from: administrator });
			await votingInstance.addVoter(batman, { from: administrator });
		});

		context('## voting status is RegisteringVoters', () => {
			const expectedStatus = 0;

			describe('> winningProposalID', () => {
				it('> should succeed when called with registered voter', async () => {
					assert.equal(
						(
							await votingInstance.winningProposalID({ from: superman })
						).toNumber(),
						0,
					);
				});
			});

			describe('> getVoter', () => {
				it('> should succeed when called with registered voter address', async () => {
					const voter = await votingInstance.getVoter(batman, { from: batman });
					assert.isFalse(voter.hasVoted);
					assert.isTrue(voter.isRegistered);
					assert.equal(voter.votedProposalId, BN(0));
				});
			});

			describe('> addVoter', () => {
				it('> should succeed when called with contrat owner address', async () => {
					const receipt = await votingInstance.addVoter(superman, {
						from: administrator,
					});
					await expectEvent(receipt, 'VoterRegistered', {
						voterAddress: superman,
					});
					const addedVoter = await votingInstance.getVoter(superman, {
						from: batman,
					});
					assert.isTrue(addedVoter.isRegistered);
					assert.isFalse(addedVoter.hasVoted);
					assert.equal(addedVoter.votedProposalId, BN(0));
				});

				it('> should fail when voter address is already registered', async () => {
					await expectRevert(
						votingInstance.addVoter(batman, { from: administrator }),
						'Already registered',
					);
				});
			});

			describe('> startProposalsRegistering', () => {
				it('> should succeed when called with contrat owner address', async () => {
					const receipt = await votingInstance.startProposalsRegistering({
						from: administrator,
					});
					await expectEvent(receipt, 'WorkflowStatusChange', {
						previousStatus: BN(expectedStatus),
						newStatus: BN(expectedStatus + 1),
					});
					assert.equal(
						(await votingInstance.workflowStatus()).toNumber(),
						expectedStatus + 1,
					);
				});
			});

			describe('> endProposalsRegistering', () => {
				it('> should fail when called with contrat owner address', async () => {
					await expectRevert(
						votingInstance.endProposalsRegistering({ from: administrator }),
						'Registering proposals havent started yet',
					);
				});
			});

			describe('> startVotingSession', () => {
				it('> should fail when called with contrat owner address', async () => {
					await expectRevert(
						votingInstance.startVotingSession({ from: administrator }),
						'Registering proposals phase is not finished',
					);
				});
			});

			describe('> endVotingSession', () => {
				it('> should fail when called with contrat owner address', async () => {
					await expectRevert(
						votingInstance.endVotingSession({ from: administrator }),
						'Voting session havent started yet',
					);
				});
			});

			describe('> addProposal', () => {
				it('> should fail when called with registered voter address', async () => {
					await expectRevert(
						votingInstance.addProposal(
							'We would never put the light in the streets',
							{ from: batman },
						),
						'Proposals are not allowed yet',
					);
				});
			});

			describe('> setVote', () => {
				it('> should fail when called with registered voter address', async () => {
					await expectRevert(
						votingInstance.setVote(1, { from: batman }),
						'Voting session havent started yet',
					);
				});
			});

			describe('> tallyVotes', () => {
				it('> should fail when called with contrat owner address', async () => {
					await expectRevert(
						votingInstance.tallyVotes({ from: administrator }),
						'Current status is not voting session ended',
					);
				});
			});

			context(
				'## voting status is ProposalsRegistrationStarted and we already have one proposal',
				() => {
					const expectedStatus = 1;

					beforeEach(async () => {
						await votingInstance.startProposalsRegistering({
							from: administrator,
						});
						await votingInstance.addProposal('Bats should replace all dogs', {
							from: batman,
						});
					});

					describe('> winningProposalID', () => {
						it('> should succeed when called with registered voter', async () => {
							assert.equal(
								(
									await votingInstance.winningProposalID({ from: superman })
								).toNumber(),
								0,
							);
						});
					});

					describe('> getVoter', () => {
						it('> should succeed when called with registered voter address', async () => {
							const voter = await votingInstance.getVoter(batman, {
								from: batman,
							});
							assert.isFalse(voter.hasVoted);
							assert.isTrue(voter.isRegistered);
							assert.equal(voter.votedProposalId, BN(0));
						});
					});

					describe('> addVoter', () => {
						it('> should fail as session status is not RegisteringVoters', async () => {
							await expectRevert(
								votingInstance.addVoter(superman, { from: administrator }),
								'Voters registration is not open yet',
							);
						});
					});

					describe('> startProposalsRegistering', () => {
						it('> should fail when called with contrat owner address', async () => {
							await expectRevert(
								votingInstance.startProposalsRegistering({
									from: administrator,
								}),
								'Registering proposals cant be started now',
							);
						});
					});

					describe('> endProposalsRegistering', () => {
						it('> should succeed when called with contrat owner address', async () => {
							const receipt = await votingInstance.endProposalsRegistering({
								from: administrator,
							});
							await expectEvent(receipt, 'WorkflowStatusChange', {
								previousStatus: BN(expectedStatus),
								newStatus: BN(expectedStatus + 1),
							});
							assert.equal(
								(await votingInstance.workflowStatus()).toNumber(),
								expectedStatus + 1,
							);
						});
					});

					describe('> startVotingSession', () => {
						it('> should fail when called with contrat owner address', async () => {
							await expectRevert(
								votingInstance.startVotingSession({ from: administrator }),
								'Registering proposals phase is not finished',
							);
						});
					});

					describe('> endVotingSession', () => {
						it('> should fail when called with contrat owner address', async () => {
							await expectRevert(
								votingInstance.endVotingSession({ from: administrator }),
								'Voting session havent started yet',
							);
						});
					});

					describe('> addProposal', () => {
						it('> should succeed when called with registered voter address', async () => {
							const batmanProposal =
								'We would never put the light in the streets';
							const expectedProposalId = 2;

							const receipt = await votingInstance.addProposal(batmanProposal, {
								from: batman,
							});
							await expectEvent(receipt, 'ProposalRegistered', {
								proposalId: BN(expectedProposalId), // expect 2nd element as GENESIS has been registered before
							});
							const addedProposal = await votingInstance.getOneProposal(
								expectedProposalId,
								{ from: batman },
							);
							assert.equal(addedProposal.description, batmanProposal);
							assert.equal(addedProposal.voteCount, BN(0));
						});
					});

					describe('> setVote', () => {
						it('> should fail when called with registered voter address', async () => {
							await expectRevert(
								votingInstance.setVote(1, { from: batman }),
								'Voting session havent started yet',
							);
						});
					});

					describe('> tallyVotes', () => {
						it('> should fail when called with contrat owner address', async () => {
							await expectRevert(
								votingInstance.tallyVotes({ from: administrator }),
								'Current status is not voting session ended',
							);
						});
					});

					context('## voting status is ProposalsRegistrationStopped', () => {
						const expectedStatus = 2;

						beforeEach(async () => {
							await votingInstance.endProposalsRegistering({
								from: administrator,
							});
						});

						describe('> winningProposalID', () => {
							it('> should succeed when called with registered voter', async () => {
								assert.equal(
									(
										await votingInstance.winningProposalID({ from: superman })
									).toNumber(),
									0,
								);
							});
						});

						describe('> getVoter', () => {
							it('> should succeed when called with registered voter address', async () => {
								const voter = await votingInstance.getVoter(batman, {
									from: batman,
								});
								assert.isFalse(voter.hasVoted);
								assert.isTrue(voter.isRegistered);
								assert.equal(voter.votedProposalId, BN(0));
							});
						});

						describe('> addVoter', () => {
							it('> should fail as session status is not RegisteringVoters', async () => {
								await expectRevert(
									votingInstance.addVoter(superman, { from: administrator }),
									'Voters registration is not open yet',
								);
							});
						});

						describe('> startProposalsRegistering', () => {
							it('> should fail when called with contrat owner address', async () => {
								await expectRevert(
									votingInstance.startProposalsRegistering({
										from: administrator,
									}),
									'Registering proposals cant be started now',
								);
							});
						});

						describe('> endProposalsRegistering', () => {
							it('> should fail when called with contrat owner address', async () => {
								await expectRevert(
									votingInstance.endProposalsRegistering({
										from: administrator,
									}),
									'Registering proposals havent started yet',
								);
							});
						});

						describe('> startVotingSession', () => {
							it('> should succeed when called with contrat owner address', async () => {
								const receipt = await votingInstance.startVotingSession({
									from: administrator,
								});
								await expectEvent(receipt, 'WorkflowStatusChange', {
									previousStatus: BN(expectedStatus),
									newStatus: BN(expectedStatus + 1),
								});
								assert.equal(
									(await votingInstance.workflowStatus()).toNumber(),
									expectedStatus + 1,
								);
							});
						});

						describe('> endVotingSession', () => {
							it('> should fail when called with contrat owner address', async () => {
								await expectRevert(
									votingInstance.endVotingSession({ from: administrator }),
									'Voting session havent started yet',
								);
							});
						});

						describe('> addProposal', () => {
							it('> should fail when called with registered voter address', async () => {
								await expectRevert(
									votingInstance.addProposal(
										'We would never put the light in the streets',
										{ from: batman },
									),
									'Proposals are not allowed yet',
								);
							});
						});

						describe('> setVote', () => {
							it('> should fail when called with registered voter address', async () => {
								await expectRevert(
									votingInstance.setVote(1, { from: batman }),
									'Voting session havent started yet',
								);
							});
						});

						describe('> tallyVotes', () => {
							it('> should fail when called with contrat owner address', async () => {
								await expectRevert(
									votingInstance.tallyVotes({ from: administrator }),
									'Current status is not voting session ended',
								);
							});
						});

						context('## voting status is VotingSessionStarted', () => {
							const expectedStatus = 3;

							beforeEach(async () => {
								await votingInstance.startVotingSession({
									from: administrator,
								});
							});

							describe('> winningProposalID', () => {
								it('> should succeed when called with registered voter', async () => {
									assert.equal(
										(
											await votingInstance.winningProposalID({ from: superman })
										).toNumber(),
										0,
									);
								});
							});

							describe('> getVoter', () => {
								it('> should succeed when called with registered voter address', async () => {
									const voter = await votingInstance.getVoter(batman, {
										from: batman,
									});
									assert.isFalse(voter.hasVoted);
									assert.isTrue(voter.isRegistered);
									assert.equal(voter.votedProposalId, BN(0));
								});
							});

							describe('> addVoter', () => {
								it('> should fail as session status is not RegisteringVoters', async () => {
									await expectRevert(
										votingInstance.addVoter(superman, { from: administrator }),
										'Voters registration is not open yet',
									);
								});
							});

							describe('> startProposalsRegistering', () => {
								it('> should fail when called with contrat owner address', async () => {
									await expectRevert(
										votingInstance.startProposalsRegistering({
											from: administrator,
										}),
										'Registering proposals cant be started now',
									);
								});
							});

							describe('> endProposalsRegistering', () => {
								it('> should fail when called with contrat owner address', async () => {
									await expectRevert(
										votingInstance.endProposalsRegistering({
											from: administrator,
										}),
										'Registering proposals havent started yet',
									);
								});
							});

							describe('> startVotingSession', () => {
								it('> should fail when called with contrat owner address', async () => {
									await expectRevert(
										votingInstance.startVotingSession({ from: administrator }),
										'Registering proposals phase is not finished',
									);
								});
							});

							describe('> endVotingSession', () => {
								it('> should succeed when called with contrat owner address', async () => {
									const receipt = await votingInstance.endVotingSession({
										from: administrator,
									});
									await expectEvent(receipt, 'WorkflowStatusChange', {
										previousStatus: BN(expectedStatus),
										newStatus: BN(expectedStatus + 1),
									});
									assert.equal(
										(await votingInstance.workflowStatus()).toNumber(),
										expectedStatus + 1,
									);
								});
							});

							describe('> addProposal', () => {
								it('> should fail when called with registered voter address', async () => {
									await expectRevert(
										votingInstance.addProposal(
											'We would never put the light in the streets',
											{ from: batman },
										),
										'Proposals are not allowed yet',
									);
								});
							});

							describe('> setVote', () => {
								it('> should succeed when called with registered voter address', async () => {
									const receipt = await votingInstance.setVote(1, {
										from: batman,
									});
									await expectEvent(receipt, 'Voted', {
										voter: batman,
										proposalId: BN(1),
									});
									const voter = await votingInstance.getVoter(batman, {
										from: batman,
									});
									assert.isTrue(voter.hasVoted);
									assert.isTrue(voter.isRegistered);
									assert.equal(voter.votedProposalId, BN(1));
								});

								it('> should fail when called with registered voter address that has already voted', async () => {
									await votingInstance.setVote(1, { from: batman });
									await expectRevert(
										votingInstance.setVote(1, { from: batman }),
										'You have already voted',
									);
								});

								it('> should fail when called with registered voter address who votes for a non registered proposal', async () => {
									await expectRevert(
										votingInstance.setVote(2, { from: batman }),
										'Proposal not found',
									);
								});
							});

							describe('> tallyVotes', () => {
								it('> should fail when called with contrat owner address', async () => {
									await expectRevert(
										votingInstance.tallyVotes({ from: administrator }),
										'Current status is not voting session ended',
									);
								});
							});

							context('## voting status is VotingSessionEnded', () => {
								const expectedStatus = 4;

								beforeEach(async () => {
									await votingInstance.endVotingSession({
										from: administrator,
									});
								});

								describe('> winningProposalID', () => {
									it('> should succeed when called with registered voter', async () => {
										assert.equal(
											(
												await votingInstance.winningProposalID({
													from: superman,
												})
											).toNumber(),
											0,
										);
									});
								});

								describe('> getVoter', () => {
									it('> should succeed when called with registered voter address', async () => {
										const voter = await votingInstance.getVoter(batman, {
											from: batman,
										});
										assert.isFalse(voter.hasVoted);
										assert.isTrue(voter.isRegistered);
										assert.equal(voter.votedProposalId, BN(0));
									});
								});

								describe('> addVoter', () => {
									it('> should fail as session status is not RegisteringVoters', async () => {
										await expectRevert(
											votingInstance.addVoter(superman, {
												from: administrator,
											}),
											'Voters registration is not open yet',
										);
									});
								});

								describe('> startProposalsRegistering', () => {
									it('> should fail when called with contrat owner address', async () => {
										await expectRevert(
											votingInstance.startProposalsRegistering({
												from: administrator,
											}),
											'Registering proposals cant be started now',
										);
									});
								});

								describe('> endProposalsRegistering', () => {
									it('> should fail when called with contrat owner address', async () => {
										await expectRevert(
											votingInstance.endProposalsRegistering({
												from: administrator,
											}),
											'Registering proposals havent started yet',
										);
									});
								});

								describe('> startVotingSession', () => {
									it('> should fail when called with contrat owner address', async () => {
										await expectRevert(
											votingInstance.startVotingSession({
												from: administrator,
											}),
											'Registering proposals phase is not finished',
										);
									});
								});

								describe('> endVotingSession', () => {
									it('> should fail when called with contrat owner address', async () => {
										await expectRevert(
											votingInstance.endVotingSession({ from: administrator }),
											'Voting session havent started yet',
										);
									});
								});

								describe('> addProposal', () => {
									it('> should fail when called with registered voter address', async () => {
										await expectRevert(
											votingInstance.addProposal(
												'We would never put the light in the streets',
												{ from: batman },
											),
											'Proposals are not allowed yet',
										);
									});
								});

								describe('> setVote', () => {
									it('> should fail when called with registered voter address', async () => {
										await expectRevert(
											votingInstance.setVote(1, { from: batman }),
											'Voting session havent started yet',
										);
									});
								});

								describe('> tallyVotes', () => {
									it('> should succeed when called with contrat owner address', async () => {
										const receipt = await votingInstance.tallyVotes({
											from: administrator,
										});
										await expectEvent(receipt, 'WorkflowStatusChange', {
											previousStatus: BN(expectedStatus),
											newStatus: BN(expectedStatus + 1),
										});
										assert.equal(
											(await votingInstance.workflowStatus()).toNumber(),
											expectedStatus + 1,
										);
									});
								});

								context('## voting status is VotesTallied', () => {
									const expectedStatus = 6;

									beforeEach(async () => {
										await votingInstance.tallyVotes({ from: administrator });
									});

									describe('> winningProposalID', () => {
										it('> should succeed when called with registered voter', async () => {
											assert.equal(
												(
													await votingInstance.winningProposalID({
														from: superman,
													})
												).toNumber(),
												0,
											);
										});
									});

									describe('> getVoter', () => {
										it('> should succeed when called with registered voter address', async () => {
											const voter = await votingInstance.getVoter(batman, {
												from: batman,
											});
											assert.isFalse(voter.hasVoted);
											assert.isTrue(voter.isRegistered);
											assert.equal(voter.votedProposalId, BN(0));
										});
									});

									describe('> addVoter', () => {
										it('> should fail as session status is not RegisteringVoters', async () => {
											await expectRevert(
												votingInstance.addVoter(superman, {
													from: administrator,
												}),
												'Voters registration is not open yet',
											);
										});
									});

									describe('> startProposalsRegistering', () => {
										it('> should fail when called with contrat owner address', async () => {
											await expectRevert(
												votingInstance.startProposalsRegistering({
													from: administrator,
												}),
												'Registering proposals cant be started now',
											);
										});
									});

									describe('> endProposalsRegistering', () => {
										it('> should fail when called with contrat owner address', async () => {
											await expectRevert(
												votingInstance.endProposalsRegistering({
													from: administrator,
												}),
												'Registering proposals havent started yet',
											);
										});
									});

									describe('> startVotingSession', () => {
										it('> should fail when called with contrat owner address', async () => {
											await expectRevert(
												votingInstance.startVotingSession({
													from: administrator,
												}),
												'Registering proposals phase is not finished',
											);
										});
									});

									describe('> endVotingSession', () => {
										it('> should fail when called with contrat owner address', async () => {
											await expectRevert(
												votingInstance.endVotingSession({
													from: administrator,
												}),
												'Voting session havent started yet',
											);
										});
									});

									describe('> addProposal', () => {
										it('> should fail when called with registered voter address', async () => {
											await expectRevert(
												votingInstance.addProposal(
													'We would never put the light in the streets',
													{ from: batman },
												),
												'Proposals are not allowed yet',
											);
										});
									});

									describe('> setVote', () => {
										it('> should fail when called with registered voter address', async () => {
											await expectRevert(
												votingInstance.setVote(1, { from: batman }),
												'Voting session havent started yet',
											);
										});
									});

									describe('> tallyVotes', () => {
										it('> should fail when called with contrat owner address', async () => {
											await expectRevert(
												votingInstance.tallyVotes({ from: administrator }),
												'Current status is not voting session ended',
											);
										});
									});
								});
							});
						});
					});
				},
			);
		});
	});

	describe('> A complete super heroes voting session', () => {
		const sessionId = 0;

		const acquaman = accounts[4];
		const ironman = accounts[5];
		const antman = accounts[6];
		const spiderman = accounts[7];

		let blockNumberBeforeProposalsRegistration: number;
		let blockNumberBeforeVotingStart: number;
		let blockNumberBeforeTallingVotes: number;

		before(async () => {
			votingInstance = await VotingAlyra.new({ from: administrator });
			await votingInstance.addVoter(superman, { from: administrator });
			await votingInstance.addVoter(batman, { from: administrator });
			await votingInstance.addVoter(wonderwoman, { from: administrator });
			await votingInstance.addVoter(acquaman, { from: administrator });
			await votingInstance.addVoter(ironman, { from: administrator });
			await votingInstance.addVoter(antman, { from: administrator });
			await votingInstance.addVoter(spiderman, { from: administrator });

			blockNumberBeforeProposalsRegistration = await web3.eth.getBlockNumber();

			await votingInstance.startProposalsRegistering({ from: administrator });

			await votingInstance.addProposal(
				'Humans should serve cryptonian people !!',
				{ from: superman },
			); // 2
			await votingInstance.addProposal('Cryptonian people should serve me', {
				from: superman,
			}); // 3
			await votingInstance.addProposal(
				'We would never put the light in the streets',
				{ from: batman },
			); // 4
			await votingInstance.addProposal(
				'Only women should be allowed to vote here next time',
				{ from: wonderwoman },
			); // 5
			await votingInstance.addProposal('We should make a big tsunami!', {
				from: acquaman,
			}); // 6

			await votingInstance.endProposalsRegistering({ from: administrator });

			blockNumberBeforeVotingStart = await web3.eth.getBlockNumber();

			await votingInstance.startVotingSession({ from: administrator });

			await votingInstance.setVote(3, { from: superman });
			await votingInstance.setVote(2, { from: batman });
			await votingInstance.setVote(3, { from: wonderwoman });
			await votingInstance.setVote(1, { from: acquaman });
			await votingInstance.setVote(5, { from: ironman });
			await votingInstance.setVote(4, { from: spiderman });

			await votingInstance.endVotingSession({ from: administrator });

			blockNumberBeforeTallingVotes = await web3.eth.getBlockNumber();

			await votingInstance.tallyVotes({ from: administrator });
		});

		it('> should allow to get a voter and his chosen proposal ID', async () => {
			assert.equal(
				(await votingInstance.getVoter(superman, { from: superman }))
					.votedProposalId,
				BN(3),
			);
			assert.equal(
				(await votingInstance.getVoter(batman, { from: superman }))
					.votedProposalId,
				BN(2),
			);
			assert.equal(
				(await votingInstance.getVoter(wonderwoman, { from: superman }))
					.votedProposalId,
				BN(3),
			);
			assert.equal(
				(await votingInstance.getVoter(acquaman, { from: superman }))
					.votedProposalId,
				BN(1),
			);
			assert.equal(
				(await votingInstance.getVoter(ironman, { from: superman }))
					.votedProposalId,
				BN(5),
			);
			assert.equal(
				(await votingInstance.getVoter(antman, { from: superman }))
					.votedProposalId,
				BN(0),
			);
			assert.equal(
				(await votingInstance.getVoter(spiderman, { from: superman }))
					.votedProposalId,
				BN(4),
			);
		});

		it('> should allow to get a proposal with corresponding description and votes count', async () => {
			assert.equal(
				(await votingInstance.getOneProposal(0, { from: superman }))
					.description,
				'GENESIS',
			);
			assert.equal(
				(await votingInstance.getOneProposal(1, { from: superman }))
					.description,
				'Humans should serve cryptonian people !!',
			);
			assert.equal(
				(await votingInstance.getOneProposal(2, { from: superman }))
					.description,
				'Cryptonian people should serve me',
			);
			assert.equal(
				(await votingInstance.getOneProposal(3, { from: superman }))
					.description,
				'We would never put the light in the streets',
			);
			assert.equal(
				(await votingInstance.getOneProposal(4, { from: superman }))
					.description,
				'Only women should be allowed to vote here next time',
			);
			assert.equal(
				(await votingInstance.getOneProposal(5, { from: superman }))
					.description,
				'We should make a big tsunami!',
			);
		});

		it('> should allow to get the voting session result', async () => {
			const winningProposalID = await votingInstance.winningProposalID();
			assert.equal(winningProposalID.toNumber(), 3);
		});

		it('> should allow to get all registered voter addresses with events', async () => {
			const events = (
				await votingInstance.getPastEvents('VoterRegistered', {
					fromBlock: 0,
					toBlock: blockNumberBeforeProposalsRegistration,
				})
			).map(mapVoterRegisteredEvent);

			assert.sameMembers(events, [
				superman,
				batman,
				wonderwoman,
				acquaman,
				ironman,
				antman,
				spiderman,
			]);
		});

		it('> should allow to get all registered proposal ids with events', async () => {
			const events = (
				await votingInstance.getPastEvents('ProposalRegistered', {
					fromBlock: blockNumberBeforeProposalsRegistration,
					toBlock: blockNumberBeforeVotingStart,
				})
			).map(mapProposalRegisteredEvent);

			assert.sameDeepMembers(events, [1, 2, 3, 4, 5]); // Adding genesis proposal does not emit event
		});

		it('> should allow to get all voters addresses that have voted with events', async () => {
			const events = (
				await votingInstance.getPastEvents('Voted', {
					fromBlock: blockNumberBeforeVotingStart,
					toBlock: blockNumberBeforeTallingVotes,
				})
			).map(mapVotedEvent);

			assert.sameDeepMembers(events, [
				{
					voter: superman,
					proposalId: 3,
				},
				{
					voter: batman,
					proposalId: 2,
				},
				{
					voter: wonderwoman,
					proposalId: 3,
				},
				{
					voter: acquaman,
					proposalId: 1,
				},
				{
					voter: ironman,
					proposalId: 5,
				},
				{
					voter: spiderman,
					proposalId: 4,
				},
			]); // missing antman who didn't vote
		});

		it('> should allow to retrieve winning proposal ID', async () => {
			assert.equal(
				(await votingInstance.winningProposalID({ from: superman })).toNumber(),
				3,
			);
		});
	});
});
