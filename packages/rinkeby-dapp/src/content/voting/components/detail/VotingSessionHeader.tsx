import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Alert,
	AlertColor,
	Box,
	Button,
	Grid,
	IconButton,
	Step,
	StepLabel,
	Stepper,
	Tooltip,
	Typography,
	useTheme,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { RootState } from 'rinkeby-types';

import VotingSessionDeleteDialog from '../list/VotingSessionDeleteDialog';

import {
	MAX_PROPOSALS,
	NEXT_VOTING_SESSION_STEP,
	VotingSessionWorkflowStatus,
} from '../../actions';
import SuspenseLoader from 'src/components/SuspenseLoader';

const steps: string[] = [
	'Created',
	'Registering voters',
	'Proposals registration started',
	'Proposals registration ended',
	'Voting session started',
	'Voting session ended',
	'Votes tallied',
];

export default () => {
	const dispatch = useDispatch();

	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
	const [nbVotesRemaining, setNbVotesRemaining] = useState<number>();

	const { contract, currentSession, voters } = useSelector(
		(state: RootState) => state.voting,
	);
	const { account } = useSelector((state: RootState) => state.ethNetwork);

	useEffect(() => {
		const _nbVotes = _.reduce(
			voters.items,
			(acc, v) => {
				if (!v.hasVoted) {
					return acc + 1;
				}
				return acc;
			},
			0,
		);
		setNbVotesRemaining(_nbVotes);
	}, [voters.items]);

	const renderVotingSessionAlert = () => {
		const renderAlert = (message: string, color: AlertColor) => {
			return (
				<Alert
					variant={'outlined'}
					severity={color}
					action={
						contract.info.isOwner && (
							<Button
								color={color}
								onClick={() => {
									dispatch(
										NEXT_VOTING_SESSION_STEP.request({
											sessionId: currentSession.item.id,
											currentStatus: currentSession.item.status,
										}),
									);
								}}
							>
								{currentSession.item.status === steps.length - 1
									? 'Finish'
									: 'Next'}
							</Button>
						)
					}
				>
					{message}
				</Alert>
			);
		};
		if (contract.info.isOwner) {
			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.RegisteringVoters
			) {
				return renderAlert('You can register new voters !', 'info');
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.ProposalsRegistrationStarted
			) {
				return renderAlert(
					'Proposals are being registered... Do you want to close registration ?',
					'info',
				);
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.ProposalsRegistrationEnded
			) {
				return renderAlert(
					'You will start the voting session. Do you want to continue ?',
					'warning',
				);
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.VotingSessionStarted
			) {
				return renderAlert(
					`There are still ${nbVotesRemaining} voters to vote`,
					'info',
				);
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.VotingSessionEnded
			) {
				return renderAlert('Please continue to tally votes !', 'warning');
			}
		} else {
			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.RegisteringVoters
			) {
				return renderAlert('Please wait during voters registration !', 'info');
			}

			if (!voters.items[account]) {
				return renderAlert(
					'You are not registered to participate to this voting session',
					'error',
				);
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.ProposalsRegistrationStarted
			) {
				const nbAlreadyProposed = voters.items[account]?.nbProposals;
				return nbAlreadyProposed < MAX_PROPOSALS
					? renderAlert(
							`Feel free to add new proposals... (remains ${
								MAX_PROPOSALS - nbAlreadyProposed
							})`,
							'warning',
					  )
					: renderAlert(
							'You already proposed 3 proposals which is the maximum',
							'success',
					  );
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.ProposalsRegistrationEnded
			) {
				return renderAlert('Voting session is not started yet.', 'warning');
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.VotingSessionStarted
			) {
				const alreadyVoted = account && voters.items[account]?.hasVoted;
				return alreadyVoted
					? renderAlert('You have already voted', 'success')
					: renderAlert('You can vote', 'info');
			}

			if (
				currentSession.item.status ===
				VotingSessionWorkflowStatus.VotingSessionEnded
			) {
				return renderAlert('Please wait until votes tallied !', 'info');
			}
		}
	};

	if (!currentSession.item) {
		return <SuspenseLoader />;
	}

	return (
		<>
			<Grid container justifyContent={'space-between'} alignItems={'center'}>
				<Grid item>
					<Typography variant={'h3'} component={'h3'} gutterBottom>
						{currentSession.item.name} - {currentSession.item.description}
					</Typography>
				</Grid>
				<Grid item>
					{currentSession.item.$capabilities.$canDelete && (
						<Tooltip placement={'bottom'} title={'Delete new session'}>
							<IconButton
								color={'primary'}
								onClick={() => setDeleteDialogVisible(!deleteDialogVisible)}
							>
								<AddCircleIcon />
							</IconButton>
						</Tooltip>
					)}
					<Grid item>
						<Box sx={{ width: '100%' }}>
							<Stepper activeStep={currentSession.item.status}>
								{steps.map((label, index) => {
									const stepProps: { completed?: boolean } = {};
									const labelProps: {} = {};
									return (
										<Step key={label} {...stepProps}>
											<StepLabel {...labelProps}>{label}</StepLabel>
										</Step>
									);
								})}
							</Stepper>
							{renderVotingSessionAlert()}
						</Box>
					</Grid>
				</Grid>
			</Grid>
			{deleteDialogVisible && (
				<VotingSessionDeleteDialog
					sessionId={currentSession.item.id}
					dialogVisible={deleteDialogVisible}
					setDialogVisible={setDeleteDialogVisible}
				/>
			)}
		</>
	);
};
