import React, { type FC, type ReactNode } from 'react';
import { HiOutlineHome } from 'react-icons/hi2';
import { SiThemoviedatabase } from 'react-icons/si';
import { VscGithub } from 'react-icons/vsc';
import SystemInfo from './SystemInfo';

const LINKS = [
	{
		icon: SiThemoviedatabase,
		url: 'https://www.themoviedb.org',
	},
	{
		icon: VscGithub,
		url: 'https://www.github.com/ehicks05/cinemang-frontend',
	},
	{
		icon: HiOutlineHome,
		url: 'https://ehicks.net',
	},
];

const Footer = () => (
	<footer className="flex justify-end gap-4 p-4">
		<SystemInfo />
		{LINKS.map(({ url, icon: Icon }) => (
			<Link href={url} key={url}>
				<Icon className="text-3xl text-emerald-500 hover:text-emerald-400" />
			</Link>
		))}
	</footer>
);

const Link: FC<{ children: ReactNode; href: string }> = ({ href, children }) => (
	<a href={href} rel="noreferrer" target="_blank">
		{children}
	</a>
);

export default React.memo(Footer);
