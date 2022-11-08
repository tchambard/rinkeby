import { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, CircularProgress, Container, Snackbar } from '@mui/material';

import { RootState } from 'rinkeby-types';

import SuspenseLoader from 'src/components/SuspenseLoader/index';
import Footer from 'src/components/Footer';
import {
	CLEAR_CREATE_VOTING_SESSION_TX_ERROR,
	LOAD_VOTING_CONTRACT_INFO,
} from '../actions';

interface IWalletContainerWrapperProps {
	children?: ReactNode;
}

export default ({ children }: IWalletContainerWrapperProps) => {
	const dispatch = useDispatch();

	const { contract, error, txPending } = useSelector(
		(state: RootState) => state.voting,
	);

	useEffect(() => {
		if (!contract.info) {
			dispatch(LOAD_VOTING_CONTRACT_INFO.request());
		}
	}, [contract.info]);

	if (contract.loading) {
		return <SuspenseLoader />;
	}

	const handleCloseErrorSnack = (
		event?: React.SyntheticEvent | Event,
		reason?: string,
	) => {
		dispatch(CLEAR_CREATE_VOTING_SESSION_TX_ERROR());
	};

	return (
		<>
			<Container sx={{ mt: 3, minHeight: '1024px' }} maxWidth="xl">
				{children}

				<Snackbar open={error != null} onClose={handleCloseErrorSnack}>
					<Alert
						severity={'error'}
						sx={{ width: '100%', color: 'red' }}
						onClose={handleCloseErrorSnack}
					>
						{error}
					</Alert>
				</Snackbar>

				<Snackbar open={txPending}>
					<Alert severity={'info'} sx={{ width: '100%' }}>
						<CircularProgress size={16} disableShrink thickness={3} />
						Transaction pending
					</Alert>
				</Snackbar>
			</Container>

			<Footer />
		</>
	);
};
