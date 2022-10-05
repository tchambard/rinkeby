import { useRoutes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { routes } from './router';
import ThemeProvider from './theme/ThemeProvider';

export default () => {

    const content = useRoutes(routes);

    return (
        <>
            <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <CssBaseline/>
                    {content}
                </LocalizationProvider>
            </ThemeProvider>
        </>
    );
};
