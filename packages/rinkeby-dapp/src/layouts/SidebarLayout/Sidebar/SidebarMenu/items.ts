import { ReactNode } from 'react';
import HomeIcon from '@mui/icons-material/Home';

export interface IMenuItem {
    link?: string;
    icon?: ReactNode;
    badge?: string;
    items?: IMenuItem[];
    name: string;
}

export interface IMenuItems {
    items: IMenuItem[];
    heading: string;
}

const menuItems: IMenuItems[] = [
    {
        heading: '',
        items: [
            {
                name: 'Home',
                link: '/home',
                icon: HomeIcon,
            },
        ],
    },
];

export default menuItems;
