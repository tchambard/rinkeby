import { forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardHeader, Divider, Grid, Snackbar, Stack } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import {FormContainer, TextFieldElement} from 'react-hook-form-mui'

import { RootState } from 'rinkeby-types';

import { CLEAR_CREATE_CONTACT_TX_ERROR, CREATE_CONTACT_ACTION, IContactForm } from '../actions';

export default () => {

  const dispatch = useDispatch();

  const { createTxPending, createTxError } = useSelector((state: RootState) => state.contacts);
  const [formData, setFormData] = useState<Partial<IContactForm>>({});


  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseErrorSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
    dispatch(CLEAR_CREATE_CONTACT_TX_ERROR());
  };

  return (
    <Card>
      <Snackbar open={createTxError != null} onClose={handleCloseErrorSnack}>
        <Alert severity="error" sx={{ width: '100%' }} onClose={handleCloseErrorSnack}>
          {createTxError}
        </Alert>
      </Snackbar>
      <CardHeader title="Create contact" />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          <FormContainer defaultValues={formData} onSuccess={(data: IContactForm) => {
            setFormData(data);
            dispatch(CREATE_CONTACT_ACTION.request(data));
          }}>

            <Stack direction={'column'}>
              <TextFieldElement type="text" name="name" label="Name" required={true} />
              <br/>
              <TextFieldElement type="tel" name="phone" label="Phone" required={true} />
              <br/>
              <LoadingButton
                loading={createTxPending}
                loadingPosition="end"
                variant="contained"
                color={'primary'}
                endIcon={<SendIcon />}
                type={'submit'}
              >
                Submit
              </LoadingButton>
            </Stack>
            
          </FormContainer>
        </Grid>
      </Box>
    </Card>
  );
}