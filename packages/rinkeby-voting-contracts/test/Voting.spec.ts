import { assert } from "chai";
import { BN, expectEvent, expectRevert } from '@openzeppelin/test-helpers';

import { VotingInstance } from "../types/Voting";

const Voting = artifacts.require('Voting');

contract('Voting', (accounts) => {

    const administrator = accounts[0];
    const batman = accounts[1];
    const superman = accounts[2];
    const acquaman = accounts[3];

    let votingInstance: VotingInstance;
    
    beforeEach(async () => {
        votingInstance = await Voting.new({ from: administrator });
        await votingInstance.registerVoter(batman, { from: administrator });
    });

    describe('> onlyOwner prevent functions to be called by non owners', () => {
        describe('> registerVoter', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.registerVoter(superman, { from: batman }), 'Ownable: caller is not the owner');
            });

            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.registerVoter(superman, { from: superman }), 'Ownable: caller is not the owner');
            });
        });

        describe('> startProposalsRegistration', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.startProposalsRegistration({ from: batman }), 'Ownable: caller is not the owner');
            });
            
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.startProposalsRegistration({ from: superman }), 'Ownable: caller is not the owner');
            });
        });

        describe('> stopProposalsRegistration', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.stopProposalsRegistration({ from: batman }), 'Ownable: caller is not the owner');
            });
            
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.stopProposalsRegistration({ from: superman }), 'Ownable: caller is not the owner');
            });
        });

        describe('> startVotingSession', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.startVotingSession({ from: batman }), 'Ownable: caller is not the owner');
            });
            
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.startVotingSession({ from: superman }), 'Ownable: caller is not the owner');
            });
        });
        
        describe('> stopVotingSession', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.stopVotingSession({ from: batman }), 'Ownable: caller is not the owner');
            });
            
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.stopVotingSession({ from: superman }), 'Ownable: caller is not the owner');
            });
        });

        describe('> tallyVotes', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.tallyVotes({ from: batman }), 'Ownable: caller is not the owner');
            });
            
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.tallyVotes({ from: superman }), 'Ownable: caller is not the owner');
            });
        });

    });

    describe('> getVoter', () => {
        it('> should fail when called with non registered voter or owner address', async () => {
            await expectRevert(votingInstance.getVoter(batman, { from: superman }), 'Caller is not owner or registered voter');
        });

        it('> should succeed when called with registered voter address', async () => {
            const voter = await votingInstance.getVoter(batman, { from: batman });
            assert.isTrue(voter.isRegistered);
            assert.isFalse(voter.hasVoted);
            assert.equal(voter.votedProposalId, BN(0));
        });

        it('> should succeed when called with contrat owner address', async () => {
            const voter = await votingInstance.getVoter(batman, { from: administrator });
            assert.isTrue(voter.isRegistered);
            assert.isFalse(voter.hasVoted);
            assert.equal(voter.votedProposalId, BN(0));
        });
    });

    context('## voting status is RegisteringVoters', () => {
        const expectedStatus = 0;

        it('> should return correct status when calling status getter', async () => {
            const status = await votingInstance.status();
            assert.equal(status.toNumber(), expectedStatus);
        });

        describe('> registerVoter', () => {
            it('> should succeed when called with contrat owner address', async () => {
                const receipt = await votingInstance.registerVoter(superman, { from: administrator });
                await expectEvent(receipt, 'VoterRegistered', {
                    voterAddress: superman,
                });
                const registeredVoter = await votingInstance.getVoter(superman, { from: administrator });
                assert.isTrue(registeredVoter.isRegistered);
                assert.isFalse(registeredVoter.hasVoted);
                assert.equal(registeredVoter.votedProposalId, BN(0));
            });

            it('> should fail when voter address is already registered', async () => {
                await expectRevert(votingInstance.registerVoter(batman, { from: administrator }), 'Voter is already registered');
            });

            it('> should fail when voter address is owner contract address', async () => {
                await expectRevert(votingInstance.registerVoter(administrator, { from: administrator }), 'Owner can not be a voter');
            });
        });

        describe('> startProposalsRegistration', () => {
            it('> should succeed when called with contrat owner address', async () => {
                const receipt = await votingInstance.startProposalsRegistration({ from: administrator });
                
                await expectEvent(receipt, 'WorkflowStatusChange', {
                    previousStatus: BN(expectedStatus),
                    newStatus: BN(expectedStatus + 1),
                });
                const status = await votingInstance.status();
                assert.equal(status.toNumber(), expectedStatus + 1);

                const p1 = await votingInstance.proposals(0);
                assert.equal(p1[0], 'Abstention');
                assert.equal(p1[1].toNumber(), 0);
                assert.equal(p1[2], administrator);
                const p2 = await votingInstance.proposals(1);
                assert.equal(p2[0], 'Blank');
                assert.equal(p2[1].toNumber(), 0);
                assert.equal(p2[2], administrator);
            });
        });

        describe('> stopProposalsRegistration', () => {            
            it('> should fail when called with contrat owner address', async () => {
                await expectRevert(votingInstance.stopProposalsRegistration({ from: administrator }), `Unexpected voting session status: expected=1 current=${expectedStatus}`);
            });
        });

        describe('> startVotingSession', () => {
            it('> should fail when called with contrat owner address', async () => {
                await expectRevert(votingInstance.startVotingSession({ from: administrator }), `Unexpected voting session status: expected=2 current=${expectedStatus}`);
            });
        });

        describe('> stopVotingSession', () => {
            it('> should fail when called with contrat owner address', async () => {
                await expectRevert(votingInstance.stopVotingSession({ from: administrator }), `Unexpected voting session status: expected=3 current=${expectedStatus}`);
            });
        });

        describe('> registerProposal', () => {
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.registerProposal('Humans should serve cryptonian people !!', { from: superman }), 'Caller is not registered voter');
            });
            
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.registerProposal('We would never put the light in the streets', { from: batman }), `Unexpected voting session status: expected=1 current=${expectedStatus}`);
            });            
            
            it('> should fail when called with contrat owner address', async () => {
                await expectRevert(votingInstance.registerProposal('Everybody should call me god !!', { from: administrator }), 'Caller is not registered voter');
            });
        });

        describe('> vote', () => {
            it('> should fail when called with registered voter address', async () => {
                await expectRevert(votingInstance.vote(0, { from: batman }), `Unexpected voting session status: expected=3 current=0`);
            });
            
            it('> should fail when called with non registered voter address', async () => {
                await expectRevert(votingInstance.vote(0, { from: superman }), 'Caller is not registered voter');
            });
            
            it('> should fail when called with contrat owner address', async () => {
                await expectRevert(votingInstance.vote(0, { from: administrator }), 'Caller is not registered voter');
            });
        });

        describe('> tallyVotes', () => {   
            it('> should fail when called with contrat owner address', async () => {
                await expectRevert(votingInstance.tallyVotes({ from: administrator }), `Unexpected voting session status: expected=4 current=0`);
            });
        });

        context('## voting status is ProposalsRegistrationStarted', () => {
            const expectedStatus = 1;

            beforeEach(async () => {
                await votingInstance.startProposalsRegistration({ from: administrator });
            });

            it('> should return correct status when calling status getter', async () => {
                const status = await votingInstance.status();
                assert.equal(status.toNumber(), 1);
            });

            describe('> registerVoter', () => {
                it('> should fail as session status is not RegisteringVoters', async () => {
                    await expectRevert(votingInstance.registerVoter(superman, { from: administrator }), `Unexpected voting session status: expected=0 current=${expectedStatus}`);
                });
            });

            describe('> startProposalsRegistration', () => {
                it('> should fail when called with contrat owner address', async () => {
                    await expectRevert(votingInstance.startProposalsRegistration({ from: administrator }), `Unexpected voting session status: expected=0 current=${expectedStatus}`);
                });
            });

            describe('> stopProposalsRegistration', () => {
                it('> should succeed when called with contrat owner address', async () => {
                    const receipt = await votingInstance.stopProposalsRegistration({ from: administrator });
                    
                    await expectEvent(receipt, 'WorkflowStatusChange', {
                        previousStatus: BN(expectedStatus),
                        newStatus: BN(expectedStatus + 1),
                    });
                    const status = await votingInstance.status();
                    assert.equal(status.toNumber(), expectedStatus + 1);
                });
            });

            describe('> startVotingSession', () => {
                it('> should fail when called with contrat owner address', async () => {
                    await expectRevert(votingInstance.startVotingSession({ from: administrator }), `Unexpected voting session status: expected=2 current=${expectedStatus}`);
                });
            });

            describe('> stopVotingSession', () => {
                it('> should fail when called with contrat owner address', async () => {
                    await expectRevert(votingInstance.stopVotingSession({ from: administrator }), `Unexpected voting session status: expected=3 current=${expectedStatus}`);
                });
            });

            describe('> registerProposal', () => {
                it('> should fail when called with non registered voter address', async () => {
                    await expectRevert(votingInstance.registerProposal('Humans should serve cryptonian people !!', { from: superman }), 'Caller is not registered voter');
                });
                
                it('> should succeed when called with registered voter address', async () => {
                    const batmanProposal = 'We would never put the light in the streets';
                    const expectedProposalId = 2;

                    const receipt = await votingInstance.registerProposal(batmanProposal, { from: batman });
                    await expectEvent(receipt, 'ProposalRegistered', {
                        proposalId: BN(expectedProposalId), // expect 3rd element as abstention and blank have been registered before
                    });
                    const p1 = await votingInstance.proposals(expectedProposalId);
                    assert.equal(p1[0], batmanProposal);
                    assert.equal(p1[1].toNumber(), 0);
                    assert.equal(p1[2], batman);
                });

                it('> should fail when called more times than maximum allowed', async () => {
                    await votingInstance.registerProposal('We would never put the light in the streets', { from: batman });
                    await votingInstance.registerProposal('We should all have a bat in our house', { from: batman });
                    await votingInstance.registerProposal('We should hang Robin', { from: batman });
                    await expectRevert(votingInstance.registerProposal('Gotham should be the capital of the world', { from: batman }), 'You already posted 3 proposals which is the maximum allowed');
                });       
                
                it('> should fail when called with contrat owner address', async () => {
                    await expectRevert(votingInstance.registerProposal('Everybody should call me god !!', { from: administrator }), 'Caller is not registered voter');
                });
            });    

            describe('> vote', () => {
                it('> should fail when called with registered voter address', async () => {
                    await expectRevert(votingInstance.vote(0, { from: batman }), `Unexpected voting session status: expected=3 current=${expectedStatus}`);
                });
                
                it('> should fail when called with non registered voter address', async () => {
                    await expectRevert(votingInstance.vote(0, { from: superman }), 'Caller is not registered voter');
                });
                
                it('> should fail when called with contrat owner address', async () => {
                    await expectRevert(votingInstance.vote(0, { from: administrator }), 'Caller is not registered voter');
                });
            });

            describe('> tallyVotes', () => {
                it('> should fail when called with contrat owner address', async () => {
                    await expectRevert(votingInstance.tallyVotes({ from: administrator }), `Unexpected voting session status: expected=4 current=${expectedStatus}`);
                });
            });

            context('## voting status is ProposalsRegistrationStopped', () => {
                const expectedStatus = 2;

                beforeEach(async () => {
                    await votingInstance.stopProposalsRegistration({ from: administrator });
                });

                it('> should return correct status when calling status getter', async () => {
                    const status = await votingInstance.status();
                    assert.equal(status.toNumber(), expectedStatus);
                });

                describe('> registerVoter', () => {
                    it('> should fail as session status is not RegisteringVoters', async () => {
                        await expectRevert(votingInstance.registerVoter(superman, { from: administrator }), `Unexpected voting session status: expected=0 current=${expectedStatus}`);
                    });
                });

                describe('> startProposalsRegistration', () => {
                    it('> should fail when called with contrat owner address', async () => {
                        await expectRevert(votingInstance.startProposalsRegistration({ from: administrator }), `Unexpected voting session status: expected=0 current=${expectedStatus}`);
                    });
                });

                describe('> stopProposalsRegistration', () => {
                    it('> should fail when called with contrat owner address', async () => {
                        await expectRevert(votingInstance.stopProposalsRegistration({ from: administrator }), `Unexpected voting session status: expected=1 current=${expectedStatus}`);
                    });
                });

                describe('> startVotingSession', () => {
                    it('> should succeed when called with contrat owner address', async () => {
                        const receipt = await votingInstance.startVotingSession({ from: administrator });

                        await expectEvent(receipt, 'WorkflowStatusChange', {
                            previousStatus: BN(expectedStatus),
                            newStatus: BN(expectedStatus + 1),
                        });
                        const status = await votingInstance.status();
                        assert.equal(status.toNumber(), expectedStatus + 1);
                    });
                });

                describe('> stopVotingSession', () => {
                    it('> should fail when called with contrat owner address', async () => {
                        await expectRevert(votingInstance.stopVotingSession({ from: administrator }), `Unexpected voting session status: expected=3 current=${expectedStatus}`);
                    });
                });

                describe('> registerProposal', () => {
                    it('> should fail when called with non registered voter address', async () => {
                        await expectRevert(votingInstance.registerProposal('Humans should serve cryptonian people !!', { from: superman }), 'Caller is not registered voter');
                    });
                    
                    it('> should fail when called with registered voter address', async () => {
                        await expectRevert(votingInstance.registerProposal('We would never put the light in the streets', { from: batman }), `Unexpected voting session status: expected=1 current=${expectedStatus}`);
                    });            
                    
                    it('> should fail when called with contrat owner address', async () => {
                        await expectRevert(votingInstance.registerProposal('Everybody should call me god !!', { from: administrator }), 'Caller is not registered voter');
                    });
                });    

                describe('> vote', () => {
                    it('> should fail when called with registered voter address', async () => {
                        await expectRevert(votingInstance.vote(0, { from: batman }), `Unexpected voting session status: expected=3 current=${expectedStatus}`);
                    });
                    
                    it('> should fail when called with non registered voter address', async () => {
                        await expectRevert(votingInstance.vote(0, { from: superman }), 'Caller is not registered voter');
                    });
                    
                    it('> should fail when called with contrat owner address', async () => {
                        await expectRevert(votingInstance.vote(0, { from: administrator }), 'Caller is not registered voter');
                    });
                });

                describe('> tallyVotes', () => {
                    it('> should fail when called with contrat owner address', async () => {
                        await expectRevert(votingInstance.tallyVotes({ from: administrator }), `Unexpected voting session status: expected=4 current=${expectedStatus}`);
                    });
                });

                context('## voting status is VotingSessionStarted', () => {
                    const expectedStatus = 3;
    
                    beforeEach(async () => {
                        await votingInstance.startVotingSession({ from: administrator });
                    });
    
                    it('> should return correct status when calling status getter', async () => {
                        const status = await votingInstance.status();
                        assert.equal(status.toNumber(), expectedStatus);
                    });
    
                    describe('> registerVoter', () => {
                        it('> should fail as session status is not RegisteringVoters', async () => {
                            await expectRevert(votingInstance.registerVoter(superman, { from: administrator }), `Unexpected voting session status: expected=0 current=${expectedStatus}`);
                        });
                    });
    
                    describe('> startProposalsRegistration', () => {
                        it('> should fail when called with contrat owner address', async () => {
                            await expectRevert(votingInstance.startProposalsRegistration({ from: administrator }), `Unexpected voting session status: expected=0 current=${expectedStatus}`);
                        });
                    });
    
                    describe('> stopProposalsRegistration', () => {
                        it('> should fail when called with contrat owner address', async () => {
                            await expectRevert(votingInstance.stopProposalsRegistration({ from: administrator }), `Unexpected voting session status: expected=1 current=${expectedStatus}`);
                        });
                    });
    
                    describe('> startVotingSession', () => {
                        it('> should fail when called with contrat owner address', async () => {
                            await expectRevert(votingInstance.startVotingSession({ from: administrator }), `Unexpected voting session status: expected=2 current=${expectedStatus}`);
                        });
                    });
    
                    describe('> stopVotingSession', () => {
                        it('> should succeed when called with contrat owner address', async () => {
                            const receipt = await votingInstance.stopVotingSession({ from: administrator });
    
                            await expectEvent(receipt, 'WorkflowStatusChange', {
                                previousStatus: BN(expectedStatus),
                                newStatus: BN(expectedStatus + 1),
                            });
                            const status = await votingInstance.status();
                            assert.equal(status.toNumber(), expectedStatus + 1);
                        });
                    });
    
                    describe('> registerProposal', () => {
                        it('> should fail when called with non registered voter address', async () => {
                            await expectRevert(votingInstance.registerProposal('Humans should serve cryptonian people !!', { from: superman }), 'Caller is not registered voter');
                        });
                        
                        it('> should fail when called with registered voter address', async () => {
                            await expectRevert(votingInstance.registerProposal('We would never put the light in the streets', { from: batman }), `Unexpected voting session status: expected=1 current=${expectedStatus}`);
                        });            
                        
                        it('> should fail when called with contrat owner address', async () => {
                            await expectRevert(votingInstance.registerProposal('Everybody should call me god !!', { from: administrator }), 'Caller is not registered voter');
                        });
                    });    
    
                    describe('> vote', () => {
                        it('> should succeed when called with registered voter address', async () => {
                            const receipt = await votingInstance.vote(1, { from: batman });
                            await expectEvent(receipt, 'Voted', {
                                voter: batman,
                                proposalId: BN(1),
                            });
                            const voter = await votingInstance.getVoter(batman, { from: administrator });
                            assert.isTrue(voter.isRegistered);
                            assert.isTrue(voter.hasVoted);
                            assert.equal(voter.votedProposalId, BN(1));

                            const p1 = await votingInstance.proposals(1);
                            assert.equal(p1[1].toNumber(), 1);
                        });

                        it('> should fail when called with registered voter address that has already voted', async () => {
                            await votingInstance.vote(1, { from: batman });
                            await expectRevert(votingInstance.vote(0, { from: batman }), 'Already voted');
                        });
                        
                        it('> should fail when called with non registered voter address', async () => {
                            await expectRevert(votingInstance.vote(0, { from: superman }), 'Caller is not registered voter');
                        });
                        
                        it('> should fail when called with contrat owner address', async () => {
                            await expectRevert(votingInstance.vote(0, { from: administrator }), 'Caller is not registered voter');
                        });
                    });
    
                    describe('> tallyVotes', () => {
                        it('> should fail when called with contrat owner address', async () => {
                            await expectRevert(votingInstance.tallyVotes({ from: administrator }), `Unexpected voting session status: expected=4 current=${expectedStatus}`);
                        });
                    });
                });
            });
        });
    });
});