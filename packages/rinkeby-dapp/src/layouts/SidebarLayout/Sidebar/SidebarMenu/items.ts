import { ReactNode } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/ImportContactsTwoTone';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

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
			{
				name: 'Voting',
				link: '/voting',
				icon: HowToVoteIcon,
			},
		],
	},
];

export default menuItems;
