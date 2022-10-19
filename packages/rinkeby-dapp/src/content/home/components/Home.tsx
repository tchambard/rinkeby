import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Footer from 'src/components/Footer';
import PaperWrapper from 'src/components/PaperWrapper';
import ContactsCreate from 'src/content/contacts/components/ContactsCreate';
import ContactsList from 'src/content/contacts/components/ContactsList';
import { Routes } from 'src/router';

export default () => {
  return (
    <>
      <Helmet>
        <title>Welcome to rinkeby dapps</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          <Grid item xs={3}>
            <Card sx={{ maxWidth: 345 }}>
              <Link to={Routes.CONTACTS}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/eth-genesis-240.jpeg"
                    alt="ethereum genesis"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Contacts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      My first dapp
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
          <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
              <Link to={Routes.VOTING}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image="/static/images/cards/eth-voting-240.jpeg"
                    alt="ethereum voting"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Voting
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      The voting project
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
            </Grid>
          </Grid>
        </Container>
      <Footer />
    </>
  );
}