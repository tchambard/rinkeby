import * as _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Grid, Container, Card, styled, Paper } from '@mui/material';

import { RootState } from 'rinkeby-types';

import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { FIND_VOTING_SESSION, GET_VOTES_RESULT, LISTEN_PROPOSAL_REGISTERED, LISTEN_VOTED, LISTEN_VOTER_REGISTERED, LISTEN_VOTES_TALLIED, LISTEN_VOTING_SESSION_STATUS_CHANGED, LIST_PROPOSALS, LIST_VOTERS, LIST_VOTES, VotingSessionWorkflowStatus } from '../../actions';
import SuspenseLoader from 'src/components/SuspenseLoader';
import VotingSessionHeader from './VotingSessionHeader';
import { useParams } from 'react-router';

import VotingSessionVotersList from './VotingSessionVotersList';
import VotingSessionProposalsList from './VotingSessionProposalsList';
import VotingSessionResult from './VotingSessionResult';

const Item = styled(Paper)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export default () => {
  const { sessionId } = useParams();

  const dispatch = useDispatch();

  const { currentSession, contract, voters, proposals } = useSelector((state: RootState) => state.voting);

  useEffect(() => {
    if (contract.info?.contract) {
      if (currentSession.item == null || currentSession.item.id !== sessionId) {
        dispatch(FIND_VOTING_SESSION.request(sessionId));
      } else {
        console.log("currentSession.item", currentSession.item)
        if (currentSession.item != null) {
          dispatch(LISTEN_VOTING_SESSION_STATUS_CHANGED.request(sessionId));
          
          if (currentSession.item.status >= VotingSessionWorkflowStatus.RegisteringVoters) {
            dispatch(LIST_VOTERS.request(currentSession.item.id));
            if (currentSession.item.status === VotingSessionWorkflowStatus.RegisteringVoters) {
              dispatch(LISTEN_VOTER_REGISTERED.request(currentSession.item.id));
            }
          }
          
          if (currentSession.item.status >= VotingSessionWorkflowStatus.ProposalsRegistrationStarted) {
            dispatch(LIST_PROPOSALS.request(currentSession.item.id));
            if (currentSession.item.status === VotingSessionWorkflowStatus.ProposalsRegistrationStarted) {
              dispatch(LISTEN_PROPOSAL_REGISTERED.request(currentSession.item.id));
            }
          }

          if (currentSession.item.status === VotingSessionWorkflowStatus.VotingSessionEnded) {
            dispatch(LISTEN_VOTES_TALLIED.request(currentSession.item.id));
          }
          
          if (currentSession.item.status === VotingSessionWorkflowStatus.VotesTallied) {
            dispatch(GET_VOTES_RESULT.request(currentSession.item.id));
          }

          if (currentSession.item.status >= VotingSessionWorkflowStatus.VotingSessionStarted) {
            // if (_.keys(voters.items).length && !voters.loading && !proposals.loading) {
              dispatch(LIST_VOTES.request(currentSession.item.id));
            // }
            if (currentSession.item.status === VotingSessionWorkflowStatus.VotingSessionStarted) {
              dispatch(LISTEN_VOTED.request(currentSession.item.id));
            }
        }
        }
      }
    }
  }, [contract.info, currentSession.item?.id, currentSession.item?.status]);

  if (!currentSession.item || currentSession.loading) {
    return <SuspenseLoader/>;
  }

  return (
    <>
      <Helmet>
          <title>{currentSession.item.name} - {currentSession.item.description}</title>
      </Helmet>
      <PageTitleWrapper>
          <VotingSessionHeader/>
      </PageTitleWrapper>
      <Container maxWidth={'xl'}>
          <Grid
              container
              direction={'row'}
              justifyContent={'center'}
              alignItems={'stretch'}
              spacing={3}
          >
            <Grid item xs={12}>
                <Item>
                  <VotingSessionResult/>
                </Item>
            </Grid>
            <Grid item xs={12} md={6}>
                <Item>
                  <VotingSessionVotersList/>
                </Item>
            </Grid>
            <Grid item xs={12} md={6}>
                <Item>
                  <VotingSessionProposalsList/>
                </Item>
            </Grid>
        </Grid>
      </Container>
    </>
  );
}