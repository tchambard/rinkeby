
import { Helmet } from 'react-helmet-async';
import { Grid, Container } from '@mui/material';

import ContactsList from './ContactsList';
import ContactsCreate from './ContactsCreate';
import Footer from 'src/components/Footer';

interface IProps {

}

export default () => {

  return (
    <>
      <Helmet>
        <title>Contacts web3 sample</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <ContactsList />
          </Grid>
          <Grid item xs={12} md={4}>
            <ContactsCreate />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}