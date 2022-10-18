import * as _ from 'lodash';
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

import BaseLayout from './layouts/BaseLayout';
import SuspenseLoader from './components/SuspenseLoader';
import SidebarLayout from './layouts/SidebarLayout';

const Loader = Component => props => (
    <Suspense fallback={<SuspenseLoader/>}>
        <Component {...props} />
    </Suspense>
);


const Home = Loader(lazy(() => import('src/content/home/components/Home')));
const Contacts = Loader(lazy(() => import('src/content/contacts/components/ContactsContainer')));

const Status404 = Loader(lazy(() => import('src/content/pages/Status/Status404')));

export class Routes {
    public static ROOT = `/`;
    public static HOME = `/home`;
    public static CONTACTS = `/contacts`;
}

export function buildRoute(route: string, params?: any) {
    return _.reduce(params, (_route, value, key) => {
        return _route.replace(new RegExp(`:${key}`, 'g'), value);
    }, route);
}

export const routes: RouteObject[] = [{
    path: Routes.ROOT,
    element: <BaseLayout/>,
    children: [{
        path: '/',
        element: <Navigate to={Routes.HOME} replace/>,
    }, {
        path: '*',
        element: <Status404/>,
    }],
}, {
    path: 'home',
    element: <SidebarLayout/>,
    children: [{
        path: Routes.HOME,
        element: <Home/>,
    }],
}, {
    path: 'contacts',
    element: <SidebarLayout/>,
    children: [{
        path: Routes.CONTACTS,
        element: <Contacts/>,
    }],
}];
