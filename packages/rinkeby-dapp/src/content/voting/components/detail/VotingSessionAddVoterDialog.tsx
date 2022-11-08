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

import { IRegisterVoterParams, REGISTER_VOTER } from '../../actions';

interface IAddVoterDialogProps {
	dialogVisible: boolean;
	setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({ dialogVisible, setDialogVisible }: IAddVoterDialogProps) => {
	const dispatch = useDispatch();

	const { txPending, currentSession } = useSelector(
		(state: RootState) => state.voting,
	);
	const [formData, setFormData] = useState<Partial<IRegisterVoterParams>>({});

	return (
		<Dialog
			disableEscapeKeyDown
			maxWidth={'sm'}
			aria-labelledby={'register-voter-title'}
			open={dialogVisible}
		>
			<DialogTitle id={'register-voter-title'}>{'Add a new voter'}</DialogTitle>
			<DialogContent dividers>
				<FormContainer
					defaultValues={formData}
					onSuccess={(data: IRegisterVoterParams) => {
						setFormData(data);
						dispatch(
							REGISTER_VOTER.request({
								sessionId: currentSession.item.id,
								address: data.address,
							}),
						);
						setDialogVisible(false);
					}}
				>
					<Stack direction={'column'}>
						<TextFieldElement
							type={'text'}
							name={'address'}
							label={'Address'}
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
				<Button
					autoFocus
					onClick={() => setDialogVisible(false)}
					color={'primary'}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
