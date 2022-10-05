import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Card, CardHeader, Divider, Grid } from '@mui/material';

import { RootState } from 'rinkeby-types';

import { LIST_CONTACTS_ACTION, ON_CONTACT_ADDED_ACTION } from '../actions';

export default () => {

    const dispatch = useDispatch();

    const { contacts } = useSelector((state: RootState) => state.contacts);
  
    useEffect(() => {
        dispatch(LIST_CONTACTS_ACTION.request());
        dispatch(ON_CONTACT_ADDED_ACTION.request());
    }, []);
  
    return (
        <Card>
            <CardHeader title="Contacts" />
            <Divider />
            <Box p={2}>
            <Grid container spacing={0}>
                {
                    Object.keys(contacts).map((contact, index) => (
                        <Grid key={`${contacts[index].name}-${index}`} item xs={12} sm={6} lg={4}>
                            <Box p={3} display="flex" alignItems="flex-start">
                                <Box pl={2}>
                                    <Typography gutterBottom variant="subtitle2">
                                        {contacts[index].name}
                                    </Typography>
                                    <Typography variant="h4" gutterBottom>
                                        {contacts[index].phone}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
            </Box>
        </Card>
    )
}
