import { assert } from "chai";
import { BN, expectEvent, expectRevert } from "@openzeppelin/test-helpers";

import { VotingInstance } from "../types/truffle/contracts/Voting";

const Voting = artifacts.require("Voting");

const mapProposalRegisteredEvent = ({ returnValues }) => ({
  proposalId: +returnValues.proposalId,
  description: returnValues.description,
});

const mapVoterRegisteredEvent = ({ returnValues }) => returnValues.voterAddress;

const mapVotedEvent = ({ returnValues }) => returnValues.voter;

const mapVotesTalliedEvent = ({ returnValues }) => ({
  votersCount: +returnValues.votersCount,
  totalVotes: +returnValues.totalVotes,
  blankVotes: +returnValues.blankVotes,
  abstention: +returnValues.abstention,
  winningProposals: returnValues.winningProposals.map((wp) => ({
    description: wp.description,
    voteCount: +wp.voteCount,
    proposer: wp.proposer,
  })),
});

contract("Voting", (accounts) => {
  const administrator = accounts[0];
  const batman = accounts[1];
  const superman = accounts[2];
  const wonderwoman = accounts[3];

  let votingInstance: VotingInstance;

  describe("> Some access controls prevent functions to be called by non owners", () => {
    const sessionId = 0;

    beforeEach(async () => {
      votingInstance = await Voting.new({ from: administrator });
    });

    describe("> createVotingSession", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.createVotingSession("test", "test", { from: batman }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.createVotingSession("test", "test", {
            from: superman,
          }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> registerVoter", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.registerVoter(sessionId, superman, { from: batman }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.registerVoter(sessionId, superman, { from: superman }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> startProposalsRegistration", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.startProposalsRegistration(sessionId, {
            from: batman,
          }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.startProposalsRegistration(sessionId, {
            from: superman,
          }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> stopProposalsRegistration", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.stopProposalsRegistration(sessionId, { from: batman }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.stopProposalsRegistration(sessionId, {
            from: superman,
          }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> startVotingSession", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.startVotingSession(sessionId, { from: batman }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.startVotingSession(sessionId, { from: superman }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> stopVotingSession", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.stopVotingSession(sessionId, { from: batman }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.stopVotingSession(sessionId, { from: superman }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> tallyVotes", () => {
      it("> should fail when called with registered voter address", async () => {
        await expectRevert(
          votingInstance.tallyVotes(sessionId, { from: batman }),
          "Ownable: caller is not the owner"
        );
      });

      it("> should fail when called with non registered voter address", async () => {
        await expectRevert(
          votingInstance.tallyVotes(sessionId, { from: superman }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("> getVote", () => {
      it("> should fail when called with non registered voter or owner address", async () => {
        await expectRevert(
          votingInstance.getVote(sessionId, batman, { from: superman }),
          "not owner or voter"
        );
      });
    });
  });

  describe("> Voting actions are conditionned by voting session status", () => {
    const sessionId = 0;

    beforeEach(async () => {
      votingInstance = await Voting.new({ from: administrator });
      await votingInstance.createVotingSession(
        "Super Heroes",
        "A vote for every superheroes to find who will rule the world"
      );
      await votingInstance.registerVoter(sessionId, batman, {
        from: administrator,
      });
    });

    context("## voting status is RegisteringVoters", () => {
      const expectedStatus = 1;

      describe("> createVotingSession", () => {
        it("> should succeed when called with contract owner address", async () => {
          const receipt = await votingInstance.createVotingSession(
            "session's name",
            "session's description",
            { from: administrator }
          );
          await expectEvent(receipt, "SessionCreated", {
            sessionId: BN(1),
            name: "session's name",
            description: "session's description",
          });
        });
      });

      describe("> getVote", () => {
        it("> should fail when called with registered voter address", async () => {
          await expectRevert(
            votingInstance.getVote(sessionId, batman, { from: batman }),
            `bad status`
          );
        });

        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.getVote(sessionId, batman, { from: administrator }),
            `bad status`
          );
        });
      });

      describe("> registerVoter", () => {
        it("> should succeed when called with contrat owner address", async () => {
          const receipt = await votingInstance.registerVoter(
            sessionId,
            superman,
            { from: administrator }
          );
          await expectEvent(receipt, "VoterRegistered", {
            sessionId: BN(0),
            voterAddress: superman,
          });
        });

        it("> should fail when voter address is already registered", async () => {
          await expectRevert(
            votingInstance.registerVoter(sessionId, batman, {
              from: administrator,
            }),
            "already registered"
          );
        });

        it("> should fail when voter address is owner contract address", async () => {
          await expectRevert(
            votingInstance.registerVoter(sessionId, administrator, {
              from: administrator,
            }),
            "can not be a voter"
          );
        });
      });

      describe("> startProposalsRegistration", () => {
        it("> should succeed when called with contrat owner address", async () => {
          const receipt = await votingInstance.startProposalsRegistration(
            sessionId,
            { from: administrator }
          );

          await expectEvent(receipt, "WorkflowStatusChange", {
            previousStatus: BN(expectedStatus),
            newStatus: BN(expectedStatus + 1),
          });

          await expectEvent(receipt, "ProposalRegistered", {
            sessionId: BN(0),
            proposalId: BN(0),
            description: "Abstention",
          });

          await expectEvent(receipt, "ProposalRegistered", {
            sessionId: BN(0),
            proposalId: BN(1),
            description: "Blank",
          });
        });
      });

      describe("> stopProposalsRegistration", () => {
        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.stopProposalsRegistration(sessionId, {
              from: administrator,
            }),
            `bad status`
          );
        });
      });

      describe("> startVotingSession", () => {
        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.startVotingSession(sessionId, {
              from: administrator,
            }),
            `bad status`
          );
        });
      });

      describe("> stopVotingSession", () => {
        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.stopVotingSession(sessionId, {
              from: administrator,
            }),
            `bad status`
          );
        });
      });

      describe("> registerProposal", () => {
        it("> should fail when called with non registered voter address", async () => {
          await expectRevert(
            votingInstance.registerProposal(
              sessionId,
              "Humans should serve cryptonian people !!",
              { from: superman }
            ),
            "not voter"
          );
        });

        it("> should fail when called with registered voter address", async () => {
          await expectRevert(
            votingInstance.registerProposal(
              sessionId,
              "We would never put the light in the streets",
              { from: batman }
            ),
            `bad status`
          );
        });

        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.registerProposal(
              sessionId,
              "Everybody should call me god !!",
              { from: administrator }
            ),
            "not voter"
          );
        });
      });

      describe("> vote", () => {
        it("> should fail when called with registered voter address", async () => {
          await expectRevert(
            votingInstance.vote(sessionId, 1, { from: batman }),
            `bad status`
          );
        });

        it("> should fail when called with non registered voter address", async () => {
          await expectRevert(
            votingInstance.vote(sessionId, 1, { from: superman }),
            "not voter"
          );
        });

        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.vote(sessionId, 1, { from: administrator }),
            "not voter"
          );
        });
      });

      describe("> tallyVotes", () => {
        it("> should fail when called with contrat owner address", async () => {
          await expectRevert(
            votingInstance.tallyVotes(sessionId, { from: administrator }),
            `bad status`
          );
        });
      });

      context("## voting status is ProposalsRegistrationStarted", () => {
        const expectedStatus = 2;

        beforeEach(async () => {
          await votingInstance.startProposalsRegistration(sessionId, {
            from: administrator,
          });
          await votingInstance.registerProposal(
            sessionId,
            "Bats should replace all dogs",
            { from: batman }
          );
        });

        describe("> createVotingSession", () => {
          it("> should succeed when called with contract owner address", async () => {
            const receipt = await votingInstance.createVotingSession(
              "session's name",
              "session's description",
              { from: administrator }
            );
            await expectEvent(receipt, "SessionCreated", {
              sessionId: BN(1),
              name: "session's name",
              description: "session's description",
            });
          });
        });

        describe("> getVote", () => {
          it("> should fail when called with registered voter address", async () => {
            await expectRevert(
              votingInstance.getVote(sessionId, batman, { from: batman }),
              `bad status`
            );
          });

          it("> should fail when called with contrat owner address", async () => {
            await expectRevert(
              votingInstance.getVote(sessionId, batman, {
                from: administrator,
              }),
              `bad status`
            );
          });
        });

        describe("> registerVoter", () => {
          it("> should fail as session status is not RegisteringVoters", async () => {
            await expectRevert(
              votingInstance.registerVoter(sessionId, superman, {
                from: administrator,
              }),
              `bad status`
            );
          });
        });

        describe("> startProposalsRegistration", () => {
          it("> should fail when called with contrat owner address", async () => {
            await expectRevert(
              votingInstance.startProposalsRegistration(sessionId, {
                from: administrator,
              }),
              `bad status`
            );
          });
        });

        describe("> stopProposalsRegistration", () => {
          it("> should succeed when called with contrat owner address", async () => {
            const receipt = await votingInstance.stopProposalsRegistration(
              sessionId,
              { from: administrator }
            );

            await expectEvent(receipt, "WorkflowStatusChange", {
              sessionId: BN(sessionId),
              previousStatus: BN(expectedStatus),
              newStatus: BN(expectedStatus + 1),
            });
          });
        });

        describe("> startVotingSession", () => {
          it("> should fail when called with contrat owner address", async () => {
            await expectRevert(
              votingInstance.startVotingSession(sessionId, {
                from: administrator,
              }),
              `bad status`
            );
          });
        });

        describe("> stopVotingSession", () => {
          it("> should fail when called with contrat owner address", async () => {
            await expectRevert(
              votingInstance.stopVotingSession(sessionId, {
                from: administrator,
              }),
              `bad status`
            );
          });
        });

        describe("> registerProposal", () => {
          it("> should fail when called with non registered voter address", async () => {
            await expectRevert(
              votingInstance.registerProposal(
                sessionId,
                "Humans should serve cryptonian people !!",
                { from: superman }
              ),
              "not voter"
            );
          });

          it("> should succeed when called with registered voter address", async () => {
            const batmanProposal =
              "We would never put the light in the streets";
            const expectedProposalId = 3;

            const receipt = await votingInstance.registerProposal(
              sessionId,
              batmanProposal,
              { from: batman }
            );
            await expectEvent(receipt, "ProposalRegistered", {
              sessionId: BN(sessionId),
              proposalId: BN(expectedProposalId), // expect 3rd element as abstention and blank have been registered before
              description: batmanProposal,
            });
          });

          it("> should fail when called more times than maximum allowed", async () => {
            await expectEvent(
              await votingInstance.registerProposal(
                sessionId,
                "We would never put the light in the streets",
                { from: batman }
              ),
              "ProposalRegistered",
              {
                sessionId: BN(sessionId),
                proposalId: BN(3), // expect 4rd element as abstention, blank and first batman vote have been registered before
              }
            );

            await expectEvent(
              await votingInstance.registerProposal(
                sessionId,
                "We should hang Robin",
                { from: batman }
              ),
              "ProposalRegistered",
              {
                sessionId: BN(sessionId),
                proposalId: BN(4), // expect 5rd element as abstention, blank and two batman votes have been registered before
              }
            );
          });

          it("> should fail when called with contrat owner address", async () => {
            await expectRevert(
              votingInstance.registerProposal(
                sessionId,
                "Everybody should call me god !!",
                { from: administrator }
              ),
              "not voter"
            );
          });
        });

        describe("> vote", () => {
          it("> should fail when called with registered voter address", async () => {
            await expectRevert(
              votingInstance.vote(sessionId, 1, { from: batman }),
              `bad status`
            );
          });
        });

        describe("> tallyVotes", () => {
          it("> should fail when called with contrat owner address", async () => {
            await expectRevert(
              votingInstance.tallyVotes(sessionId, { from: administrator }),
              `bad status`
            );
          });
        });

        context("## voting status is ProposalsRegistrationStopped", () => {
          const expectedStatus = 3;

          beforeEach(async () => {
            await votingInstance.stopProposalsRegistration(sessionId, {
              from: administrator,
            });
          });

          describe("> createVotingSession", () => {
            it("> should succeed when called with contract owner address", async () => {
              const receipt = await votingInstance.createVotingSession(
                "session's name",
                "session's description",
                { from: administrator }
              );
              await expectEvent(receipt, "SessionCreated", {
                sessionId: BN(1),
                name: "session's name",
                description: "session's description",
              });
            });
          });

          describe("> getVote", () => {
            it("> should fail when called with registered voter address", async () => {
              await expectRevert(
                votingInstance.getVote(sessionId, batman, { from: batman }),
                `bad status`
              );
            });

            it("> should fail when called with contrat owner address", async () => {
              await expectRevert(
                votingInstance.getVote(sessionId, batman, {
                  from: administrator,
                }),
                `bad status`
              );
            });
          });

          describe("> registerVoter", () => {
            it("> should fail as session status is not RegisteringVoters", async () => {
              await expectRevert(
                votingInstance.registerVoter(sessionId, superman, {
                  from: administrator,
                }),
                `bad status`
              );
            });
          });

          describe("> startProposalsRegistration", () => {
            it("> should fail when called with contrat owner address", async () => {
              await expectRevert(
                votingInstance.startProposalsRegistration(sessionId, {
                  from: administrator,
                }),
                `bad status`
              );
            });
          });

          describe("> stopProposalsRegistration", () => {
            it("> should fail when called with contrat owner address", async () => {
              await expectRevert(
                votingInstance.stopProposalsRegistration(sessionId, {
                  from: administrator,
                }),
                `bad status`
              );
            });
          });

          describe("> startVotingSession", () => {
            it("> should succeed when called with contrat owner address", async () => {
              const receipt = await votingInstance.startVotingSession(
                sessionId,
                { from: administrator }
              );

              await expectEvent(receipt, "WorkflowStatusChange", {
                sessionId: BN(sessionId),
                previousStatus: BN(expectedStatus),
                newStatus: BN(expectedStatus + 1),
              });
            });
          });

          describe("> stopVotingSession", () => {
            it("> should fail when called with contrat owner address", async () => {
              await expectRevert(
                votingInstance.stopVotingSession(sessionId, {
                  from: administrator,
                }),
                `bad status`
              );
            });
          });

          describe("> registerProposal", () => {
            it("> should fail when called with registered voter address", async () => {
              await expectRevert(
                votingInstance.registerProposal(
                  sessionId,
                  "We would never put the light in the streets",
                  { from: batman }
                ),
                `bad status`
              );
            });
          });

          describe("> vote", () => {
            it("> should fail when called with registered voter address", async () => {
              await expectRevert(
                votingInstance.vote(sessionId, 1, { from: batman }),
                `bad status`
              );
            });
          });

          describe("> tallyVotes", () => {
            it("> should fail when called with contrat owner address", async () => {
              await expectRevert(
                votingInstance.tallyVotes(sessionId, { from: administrator }),
                `bad status`
              );
            });
          });

          context("## voting status is VotingSessionStarted", () => {
            const expectedStatus = 4;

            beforeEach(async () => {
              await votingInstance.startVotingSession(sessionId, {
                from: administrator,
              });
            });

            describe("> createVotingSession", () => {
              it("> should succeed when called with contract owner address", async () => {
                const receipt = await votingInstance.createVotingSession(
                  "session's name",
                  "session's description",
                  { from: administrator }
                );
                await expectEvent(receipt, "SessionCreated", {
                  sessionId: BN(1),
                  name: "session's name",
                  description: "session's description",
                });
              });
            });

            describe("> getVote", () => {
              it("> should succeed when called with registered voter address", async () => {
                const vote = await votingInstance.getVote(sessionId, batman, {
                  from: batman,
                });
                assert.equal(vote.toNumber(), 0);
              });

              it("> should succeed when called with contrat owner address", async () => {
                const vote = await votingInstance.getVote(sessionId, batman, {
                  from: administrator,
                });
                assert.equal(vote.toNumber(), 0);
              });
            });

            describe("> registerVoter", () => {
              it("> should fail as session status is not RegisteringVoters", async () => {
                await expectRevert(
                  votingInstance.registerVoter(sessionId, superman, {
                    from: administrator,
                  }),
                  `bad status`
                );
              });
            });

            describe("> startProposalsRegistration", () => {
              it("> should fail when called with contrat owner address", async () => {
                await expectRevert(
                  votingInstance.startProposalsRegistration(sessionId, {
                    from: administrator,
                  }),
                  `bad status`
                );
              });
            });

            describe("> stopProposalsRegistration", () => {
              it("> should fail when called with contrat owner address", async () => {
                await expectRevert(
                  votingInstance.stopProposalsRegistration(sessionId, {
                    from: administrator,
                  }),
                  `bad status`
                );
              });
            });

            describe("> startVotingSession", () => {
              it("> should fail when called with contrat owner address", async () => {
                await expectRevert(
                  votingInstance.startVotingSession(sessionId, {
                    from: administrator,
                  }),
                  `bad status`
                );
              });
            });

            describe("> stopVotingSession", () => {
              it("> should succeed when called with contrat owner address", async () => {
                const receipt = await votingInstance.stopVotingSession(
                  sessionId,
                  { from: administrator }
                );

                await expectEvent(receipt, "WorkflowStatusChange", {
                  sessionId: BN(sessionId),
                  previousStatus: BN(expectedStatus),
                  newStatus: BN(expectedStatus + 1),
                });
              });
            });

            describe("> registerProposal", () => {
              it("> should fail when called with registered voter address", async () => {
                await expectRevert(
                  votingInstance.registerProposal(
                    sessionId,
                    "We would never put the light in the streets",
                    { from: batman }
                  ),
                  `bad status`
                );
              });
            });

            describe("> vote", () => {
              it("> should succeed when called with registered voter address", async () => {
                const receipt = await votingInstance.vote(sessionId, 1, {
                  from: batman,
                });
                await expectEvent(receipt, "Voted", {
                  sessionId: BN(sessionId),
                  voter: batman,
                });
              });

              it("> should fail when called with registered voter address that has already voted", async () => {
                await votingInstance.vote(sessionId, 1, { from: batman });
                await expectRevert(
                  votingInstance.vote(sessionId, 1, { from: batman }),
                  "already voted"
                );
              });

              it("> should fail when called with registered voter address who votes for abstention proposal", async () => {
                await expectRevert(
                  votingInstance.vote(sessionId, 0, { from: batman }),
                  "abstention forbidden"
                );
              });
            });

            describe("> tallyVotes", () => {
              it("> should fail when called with contrat owner address", async () => {
                await expectRevert(
                  votingInstance.tallyVotes(sessionId, { from: administrator }),
                  `bad status`
                );
              });
            });

            context("## voting status is VotingSessionEnded", () => {
              const expectedStatus = 5;

              beforeEach(async () => {
                await votingInstance.stopVotingSession(sessionId, {
                  from: administrator,
                });
              });

              describe("> createVotingSession", () => {
                it("> should succeed when called with contract owner address", async () => {
                  const receipt = await votingInstance.createVotingSession(
                    "session's name",
                    "session's description",
                    { from: administrator }
                  );
                  await expectEvent(receipt, "SessionCreated", {
                    sessionId: BN(1),
                    name: "session's name",
                    description: "session's description",
                  });
                });
              });

              describe("> getVote", () => {
                it("> should succeed when called with registered voter address", async () => {
                  const vote = await votingInstance.getVote(sessionId, batman, {
                    from: batman,
                  });
                  assert.equal(vote.toNumber(), 0);
                });

                it("> should succeed when called with contrat owner address", async () => {
                  const vote = await votingInstance.getVote(sessionId, batman, {
                    from: administrator,
                  });
                  assert.equal(vote.toNumber(), 0);
                });
              });

              describe("> registerVoter", () => {
                it("> should fail as session status is not RegisteringVoters", async () => {
                  await expectRevert(
                    votingInstance.registerVoter(sessionId, superman, {
                      from: administrator,
                    }),
                    `bad status`
                  );
                });
              });

              describe("> startProposalsRegistration", () => {
                it("> should fail when called with contrat owner address", async () => {
                  await expectRevert(
                    votingInstance.startProposalsRegistration(sessionId, {
                      from: administrator,
                    }),
                    `bad status`
                  );
                });
              });

              describe("> stopProposalsRegistration", () => {
                it("> should fail when called with contrat owner address", async () => {
                  await expectRevert(
                    votingInstance.stopProposalsRegistration(sessionId, {
                      from: administrator,
                    }),
                    `bad status`
                  );
                });
              });

              describe("> startVotingSession", () => {
                it("> should fail when called with contrat owner address", async () => {
                  await expectRevert(
                    votingInstance.startVotingSession(sessionId, {
                      from: administrator,
                    }),
                    `bad status`
                  );
                });
              });

              describe("> stopVotingSession", () => {
                it("> should fail when called with contrat owner address", async () => {
                  await expectRevert(
                    votingInstance.stopVotingSession(sessionId, {
                      from: administrator,
                    }),
                    `bad status`
                  );
                });
              });

              describe("> registerProposal", () => {
                it("> should fail when called with registered voter address", async () => {
                  await expectRevert(
                    votingInstance.registerProposal(
                      sessionId,
                      "We would never put the light in the streets",
                      { from: batman }
                    ),
                    `bad status`
                  );
                });
              });

              describe("> vote", () => {
                it("> should fail when called with registered voter address", async () => {
                  await expectRevert(
                    votingInstance.vote(sessionId, 1, { from: batman }),
                    `bad status`
                  );
                });
              });

              describe("> tallyVotes", () => {
                it("> should succeed when called with contrat owner address", async () => {
                  const receipt = await votingInstance.tallyVotes(sessionId, {
                    from: administrator,
                  });
                  await expectEvent(receipt, "WorkflowStatusChange", {
                    sessionId: BN(sessionId),
                    previousStatus: BN(expectedStatus),
                    newStatus: BN(expectedStatus + 1),
                  });

                  await expectEvent(receipt, "VotesTallied", {
                    sessionId: BN(sessionId),
                    votersCount: BN(1),
                    totalVotes: BN(0),
                    blankVotes: BN(0),
                    abstention: BN(1),
                    winningProposals: [],
                  });
                });
              });

              context("## voting status is VotesTallied", () => {
                const expectedStatus = 6;

                beforeEach(async () => {
                  await votingInstance.tallyVotes(sessionId, {
                    from: administrator,
                  });
                });

                describe("> createVotingSession", () => {
                  it("> should succeed when called with contract owner address", async () => {
                    const receipt = await votingInstance.createVotingSession(
                      "session's name",
                      "session's description",
                      { from: administrator }
                    );
                    await expectEvent(receipt, "SessionCreated", {
                      sessionId: BN(1),
                      name: "session's name",
                      description: "session's description",
                    });
                  });
                });

                describe("> getVote", () => {
                  it("> should succeed when called with registered voter address", async () => {
                    const vote = await votingInstance.getVote(
                      sessionId,
                      batman,
                      { from: batman }
                    );
                    assert.equal(vote.toNumber(), 0);
                  });

                  it("> should succeed when called with contrat owner address", async () => {
                    const vote = await votingInstance.getVote(
                      sessionId,
                      batman,
                      { from: administrator }
                    );
                    assert.equal(vote.toNumber(), 0);
                  });
                });

                describe("> registerVoter", () => {
                  it("> should fail as session status is not RegisteringVoters", async () => {
                    await expectRevert(
                      votingInstance.registerVoter(sessionId, superman, {
                        from: administrator,
                      }),
                      `bad status`
                    );
                  });
                });

                describe("> startProposalsRegistration", () => {
                  it("> should fail when called with contrat owner address", async () => {
                    await expectRevert(
                      votingInstance.startProposalsRegistration(sessionId, {
                        from: administrator,
                      }),
                      `bad status`
                    );
                  });
                });

                describe("> stopProposalsRegistration", () => {
                  it("> should fail when called with contrat owner address", async () => {
                    await expectRevert(
                      votingInstance.stopProposalsRegistration(sessionId, {
                        from: administrator,
                      }),
                      `bad status`
                    );
                  });
                });

                describe("> startVotingSession", () => {
                  it("> should fail when called with contrat owner address", async () => {
                    await expectRevert(
                      votingInstance.startVotingSession(sessionId, {
                        from: administrator,
                      }),
                      `bad status`
                    );
                  });
                });

                describe("> stopVotingSession", () => {
                  it("> should fail when called with contrat owner address", async () => {
                    await expectRevert(
                      votingInstance.stopVotingSession(sessionId, {
                        from: administrator,
                      }),
                      `bad status`
                    );
                  });
                });

                describe("> registerProposal", () => {
                  it("> should fail when called with registered voter address", async () => {
                    await expectRevert(
                      votingInstance.registerProposal(
                        sessionId,
                        "We would never put the light in the streets",
                        { from: batman }
                      ),
                      `bad status`
                    );
                  });
                });

                describe("> vote", () => {
                  it("> should fail when called with registered voter address", async () => {
                    await expectRevert(
                      votingInstance.vote(sessionId, 1, { from: batman }),
                      `bad status`
                    );
                  });
                });

                describe("> tallyVotes", () => {
                  it("> should fail when called with contrat owner address", async () => {
                    await expectRevert(
                      votingInstance.tallyVotes(sessionId, {
                        from: administrator,
                      }),
                      `bad status`
                    );
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe("> A complete super heroes voting session", () => {
    const sessionId = 0;

    const acquaman = accounts[4];
    const ironman = accounts[5];
    const antman = accounts[6];
    const spiderman = accounts[7];

    let blockNumberBeforeProposalsRegistration: number;
    let blockNumberBeforeVotingStart: number;
    let blockNumberBeforeTallingVotes: number;

    before(async () => {
      votingInstance = await Voting.new({ from: administrator });
      await votingInstance.createVotingSession("Super Heroes", "Complete vote");
      await votingInstance.registerVoter(sessionId, superman, {
        from: administrator,
      });
      await votingInstance.registerVoter(sessionId, batman, {
        from: administrator,
      });
      await votingInstance.registerVoter(sessionId, wonderwoman, {
        from: administrator,
      });
      await votingInstance.registerVoter(sessionId, acquaman, {
        from: administrator,
      });
      await votingInstance.registerVoter(sessionId, ironman, {
        from: administrator,
      });
      await votingInstance.registerVoter(sessionId, antman, {
        from: administrator,
      });
      await votingInstance.registerVoter(sessionId, spiderman, {
        from: administrator,
      });

      blockNumberBeforeProposalsRegistration = await web3.eth.getBlockNumber();

      await votingInstance.startProposalsRegistration(sessionId);

      await votingInstance.registerProposal(
        sessionId,
        "Humans should serve cryptonian people !!",
        { from: superman }
      ); // 2
      await votingInstance.registerProposal(
        sessionId,
        "Cryptonian people should serve me",
        { from: superman }
      ); // 3
      await votingInstance.registerProposal(
        sessionId,
        "We would never put the light in the streets",
        { from: batman }
      ); // 4
      await votingInstance.registerProposal(
        sessionId,
        "Only women should be allowed to vote here next time",
        { from: wonderwoman }
      ); // 5
      await votingInstance.registerProposal(
        sessionId,
        "We should make a big tsunami!",
        { from: acquaman }
      ); // 6

      await votingInstance.stopProposalsRegistration(sessionId);

      blockNumberBeforeVotingStart = await web3.eth.getBlockNumber();

      await votingInstance.startVotingSession(sessionId);

      await votingInstance.vote(sessionId, 4, { from: superman });
      await votingInstance.vote(sessionId, 3, { from: batman });
      await votingInstance.vote(sessionId, 4, { from: wonderwoman });
      await votingInstance.vote(sessionId, 1, { from: acquaman });
      await votingInstance.vote(sessionId, 6, { from: ironman });
      await votingInstance.vote(sessionId, 3, { from: spiderman });

      await votingInstance.stopVotingSession(sessionId);

      blockNumberBeforeTallingVotes = await web3.eth.getBlockNumber();

      await votingInstance.tallyVotes(sessionId);
    });

    it("> should allow to get all registered voter addresses with events", async () => {
      const events = (
        await votingInstance.getPastEvents("VoterRegistered", {
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

    it("> should allow to get all registered proposal ids with events", async () => {
      const events = (
        await votingInstance.getPastEvents("ProposalRegistered", {
          fromBlock: blockNumberBeforeProposalsRegistration,
          toBlock: blockNumberBeforeVotingStart,
        })
      ).map(mapProposalRegisteredEvent);

      assert.sameDeepMembers(events, [
        {
          proposalId: 0,
          description: "Abstention",
        },
        {
          proposalId: 1,
          description: "Blank",
        },
        {
          proposalId: 2,
          description: "Humans should serve cryptonian people !!",
        },
        {
          proposalId: 3,
          description: "Cryptonian people should serve me",
        },
        {
          proposalId: 4,
          description: "We would never put the light in the streets",
        },
        {
          proposalId: 5,
          description: "Only women should be allowed to vote here next time",
        },
        {
          proposalId: 6,
          description: "We should make a big tsunami!",
        },
      ]);
    });

    it("> should allow to get all voters addresses that have voted with events", async () => {
      const events = (
        await votingInstance.getPastEvents("Voted", {
          fromBlock: blockNumberBeforeVotingStart,
          toBlock: blockNumberBeforeTallingVotes,
        })
      ).map(({ returnValues }) => returnValues.voter);

      assert.sameMembers(events, [
        superman,
        batman,
        wonderwoman,
        acquaman,
        ironman,
        spiderman,
      ]); // missing antman who didn't vote
    });

    it("> should allow to get the voting session result with events", async () => {
      const [events] = (
        await votingInstance.getPastEvents("VotesTallied", {
          fromBlock: blockNumberBeforeTallingVotes,
        })
      ).map(mapVotesTalliedEvent);

      assert.deepEqual(events, {
        votersCount: 7,
        totalVotes: 6,
        blankVotes: 1,
        abstention: 1,
        winningProposals: [
          {
            description: "Cryptonian people should serve me",
            voteCount: 2,
            proposer: superman,
          },
          {
            description: "We would never put the light in the streets",
            voteCount: 2,
            proposer: batman,
          },
        ],
      });
    });
  });

  describe("> Many parallel voting sessions", () => {
    const s0 = 0;
    const s1 = 1;

    const acquaman = accounts[4];
    const ironman = accounts[5];
    const antman = accounts[6];
    const spiderman = accounts[7];

    before(async () => {
      // Every calls are mixed voluntary and it makes the code a little difficult to read
      votingInstance = await Voting.new({ from: administrator });
      await votingInstance.createVotingSession("Super Heroes", "All supers");
      await votingInstance.registerVoter(s0, superman, { from: administrator });
      await votingInstance.registerVoter(s0, ironman, { from: administrator });
      await votingInstance.createVotingSession(
        "Best Super Heroes",
        "Only girls"
      );
      await votingInstance.registerVoter(s0, antman, { from: administrator });
      await votingInstance.registerVoter(s1, wonderwoman, {
        from: administrator,
      });
      await votingInstance.registerVoter(s1, acquaman, { from: administrator });
      await votingInstance.registerVoter(s0, batman, { from: administrator });
      await votingInstance.registerVoter(s0, spiderman, {
        from: administrator,
      });
      await votingInstance.startProposalsRegistration(s0);
      await votingInstance.registerVoter(s1, spiderman, {
        from: administrator,
      });
      await votingInstance.startProposalsRegistration(s1);
      await votingInstance.registerProposal(
        s0,
        "Humans should serve cryptonian people !!",
        { from: superman }
      );
      await votingInstance.registerProposal(
        s1,
        "We need to show to the world that super women are better than men",
        { from: spiderman }
      );
      await votingInstance.registerProposal(
        s0,
        "All supers should stop calling me little girl",
        { from: spiderman }
      );
      await votingInstance.stopProposalsRegistration(s0);
      await votingInstance.startVotingSession(s0);
      await votingInstance.vote(s0, 1, { from: superman });
      await votingInstance.registerProposal(
        s1,
        "Voting should be forbidden to men",
        { from: wonderwoman }
      );
      await votingInstance.vote(s0, 1, { from: batman });
      await votingInstance.stopProposalsRegistration(s1);
      await votingInstance.startVotingSession(s1);
      await votingInstance.vote(s1, 2, { from: wonderwoman });
      await votingInstance.vote(s1, 1, { from: acquaman });
      await votingInstance.vote(s0, 3, { from: ironman });
      await votingInstance.vote(s0, 1, { from: spiderman });
      await votingInstance.stopVotingSession(s0);
      await votingInstance.tallyVotes(s0);
      await votingInstance.vote(s1, 1, { from: spiderman });
      await votingInstance.stopVotingSession(s1);
      await votingInstance.tallyVotes(s1);
    });

    it("> should allow to get all registered voter addresses with events filtering on sessionId", async () => {
      const s0_events = (
        await votingInstance.getPastEvents("VoterRegistered", {
          fromBlock: 0,
          filter: { sessionId: BN(s0) },
        })
      ).map(mapVoterRegisteredEvent);

      assert.sameMembers(s0_events, [
        superman,
        ironman,
        antman,
        batman,
        spiderman,
      ]);

      const s1_events = (
        await votingInstance.getPastEvents("VoterRegistered", {
          fromBlock: 0,
          filter: { sessionId: BN(s1) },
        })
      ).map(mapVoterRegisteredEvent);

      assert.sameMembers(s1_events, [wonderwoman, acquaman, spiderman]);
    });

    it("> should allow to get all registered proposal ids with events filtering on sessionId", async () => {
      const s0_events = (
        await votingInstance.getPastEvents("ProposalRegistered", {
          fromBlock: 0,
          filter: { sessionId: BN(s0) },
        })
      ).map(mapProposalRegisteredEvent);

      assert.sameDeepMembers(s0_events, [
        {
          proposalId: 0,
          description: "Abstention",
        },
        {
          proposalId: 1,
          description: "Blank",
        },
        {
          proposalId: 2,
          description: "Humans should serve cryptonian people !!",
        },
        {
          proposalId: 3,
          description: "All supers should stop calling me little girl",
        },
      ]);

      const s1_events = (
        await votingInstance.getPastEvents("ProposalRegistered", {
          fromBlock: 0,
          filter: { sessionId: BN(s1) },
        })
      ).map(mapProposalRegisteredEvent);

      assert.sameDeepMembers(s1_events, [
        {
          proposalId: 0,
          description: "Abstention",
        },
        {
          proposalId: 1,
          description: "Blank",
        },
        {
          proposalId: 2,
          description:
            "We need to show to the world that super women are better than men",
        },
        {
          proposalId: 3,
          description: "Voting should be forbidden to men",
        },
      ]);
    });

    it("> should allow to get all voters addresses that have voted with events filtering on sessionId", async () => {
      const s0_events = (
        await votingInstance.getPastEvents("Voted", {
          fromBlock: 0,
          filter: { sessionId: BN(s0) },
        })
      ).map(mapVotedEvent);

      assert.sameMembers(s0_events, [superman, batman, ironman, spiderman]);

      const s1_events = (
        await votingInstance.getPastEvents("Voted", {
          fromBlock: 0,
          filter: { sessionId: BN(s1) },
        })
      ).map(({ returnValues }) => returnValues.voter);

      assert.sameMembers(s1_events, [wonderwoman, acquaman, spiderman]);
    });

    it("> should allow to get the voting session result with events filtering on sessionId", async () => {
      const [s0_events] = (
        await votingInstance.getPastEvents("VotesTallied", {
          fromBlock: 0,
          filter: { sessionId: BN(s0) },
        })
      ).map(mapVotesTalliedEvent);

      assert.deepEqual(s0_events, {
        votersCount: 5,
        totalVotes: 4,
        blankVotes: 3,
        abstention: 1,
        winningProposals: [
          {
            description: "All supers should stop calling me little girl",
            voteCount: 1,
            proposer: spiderman,
          },
        ],
      });

      const [s1_events] = (
        await votingInstance.getPastEvents("VotesTallied", {
          fromBlock: 0,
          filter: { sessionId: BN(s1) },
        })
      ).map(mapVotesTalliedEvent);

      assert.deepEqual(s1_events, {
        votersCount: 3,
        totalVotes: 3,
        blankVotes: 2,
        abstention: 0,
        winningProposals: [
          {
            description:
              "We need to show to the world that super women are better than men",
            voteCount: 1,
            proposer: spiderman,
          },
        ],
      });
    });
  });

  describe("> Number of proposal registration is limited to 256", function () {
    this.timeout(10000);
    const sessionId = 0;

    before(async () => {
      votingInstance = await Voting.new({ from: administrator });
      await votingInstance.createVotingSession(
        "Limit proposal registration to 256",
        "test"
      );
      await votingInstance.registerVoter(sessionId, superman, {
        from: administrator,
      });
      await votingInstance.startProposalsRegistration(sessionId);
    });

    it("> should reject when adding 256th proposal", async () => {
      for (let i = 1; i < 256; i++) {
        await votingInstance.registerProposal(sessionId, `p${i}`, {
          from: superman,
        });
      }
      await expectRevert(
        votingInstance.registerProposal(sessionId, `p256`, { from: superman }),
        `VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)`
      );
    });
  });
});
