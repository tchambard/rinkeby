import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Routes } from 'src/router';
import { DELETE_VOTING_SESSION } from '../../actions';

interface IVotingSessionDeleteDialogProps {
    sessionId: string;
    dialogVisible: boolean;
    setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default ({ sessionId, dialogVisible, setDialogVisible }: IVotingSessionDeleteDialogProps) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return <Dialog
        disableEscapeKeyDown
        maxWidth={'sm'}
        aria-labelledby={'delete-wallet-title'}
        open={dialogVisible}
    >
        <DialogTitle id={'delete-wallet-title'}>{'Are you sure to delete this wallet ?'}</DialogTitle>
        <DialogContent dividers>
            <DialogContentText id={'alert-dialog-description'}>
                This operation will remove all data related to the voting session.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={() => setDialogVisible(false)} color={'primary'}>
                Cancel
            </Button>
            <Button
                color={'primary'}
                onClick={() => {
                    dispatch(DELETE_VOTING_SESSION.request({ sessionId }));

                    setDialogVisible(false);
                    navigate(Routes.VOTING_SESSION_LIST);
                }}
            >Ok</Button>
        </DialogActions>
    </Dialog>;
};
