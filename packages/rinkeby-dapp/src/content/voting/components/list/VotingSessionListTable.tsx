import { useEffect } from 'react';
import {
	Card,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import VotingSessionListItemActions from './VotingSessionListItemActions';

import { RootState } from 'rinkeby-types';
import {
	LISTEN_VOTING_SESSION_CREATED,
	LIST_VOTING_SESSIONS,
} from '../../actions';
import SuspenseLoader from 'src/components/SuspenseLoader';

export default () => {
	const dispatch = useDispatch();

	const { txPending: loading, sessions } = useSelector(
		(state: RootState) => state.voting,
	);

	useEffect(() => {
		dispatch(LIST_VOTING_SESSIONS.request());
		dispatch(LISTEN_VOTING_SESSION_CREATED.request());
	}, []);

	if (loading) {
		return <SuspenseLoader />;
	}
	return (
		<>
			<Card>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Description</TableCell>
								<TableCell align={'right'}>Actions</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{sessions.items.map((session) => {
								return (
									<TableRow hover key={session.id}>
										<TableCell>
											<Link to={`/voting/${session.id}`}>
												<Typography
													variant={'body1'}
													fontWeight={'bold'}
													color={'text.primary'}
													gutterBottom
													noWrap
												>
													{session.name}
												</Typography>
											</Link>
										</TableCell>
										<TableCell>
											<Typography
												variant={'body1'}
												fontWeight={'bold'}
												color={'text.primary'}
												gutterBottom
												noWrap
											>
												{session.description}
											</Typography>
										</TableCell>
										<TableCell align={'right'}>
											<VotingSessionListItemActions
												currentView={'list'}
												sessionId={session.id}
												capabilities={session.$capabilities}
											/>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			</Card>
		</>
	);
};
