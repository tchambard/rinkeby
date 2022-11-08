import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';

import { RootState } from 'rinkeby-types';

import {
	CREATE_VOTING_SESSION,
	ICreateVotingSessionParams,
} from '../../actions';

interface IVoterSessionCreateDialogProps {
	dialogVisible: boolean;
	setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({
	dialogVisible,
	setDialogVisible,
}: IVoterSessionCreateDialogProps) => {
	const dispatch = useDispatch();

	const { txPending } = useSelector((state: RootState) => state.voting);
	const [formData, setFormData] = useState<Partial<ICreateVotingSessionParams>>(
		{},
	);

	return (
		<Dialog
			disableEscapeKeyDown
			maxWidth={'sm'}
			aria-labelledby={'new-voting-session-title'}
			open={dialogVisible}
		>
			<DialogTitle id={'new-voting-session-title'}>
				{'Create new session'}
			</DialogTitle>
			<DialogContent dividers>
				<FormContainer
					defaultValues={formData}
					onSuccess={(data: ICreateVotingSessionParams) => {
						setFormData(data);
						dispatch(CREATE_VOTING_SESSION.request(data));
						setDialogVisible(false);
					}}
				>
					<Stack direction={'column'}>
						<TextFieldElement
							type={'text'}
							name={'name'}
							label={'Name'}
							required={true}
						/>
						<br />
						<TextFieldElement
							type={'text'}
							name={'description'}
							label={'Description'}
							required={true}
						/>
						<br />
						<LoadingButton
							loading={txPending}
							loadingPosition={'end'}
							variant={'contained'}
							color={'primary'}
							endIcon={<SendIcon />}
							type={'submit'}
						>
							Submit
						</LoadingButton>
					</Stack>
				</FormContainer>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={() => setDialogVisible(false)} color={'primary'}>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
