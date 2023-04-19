import React, { FC, ReactNode } from 'react';
import { FaGithubSquare, FaHome } from 'react-icons/fa';
import { SiThemoviedatabase } from 'react-icons/si';

const LINKS = [
  {
    icon: SiThemoviedatabase,
    url: 'https://www.themoviedb.org',
  },
  {
    icon: FaGithubSquare,
    url: 'https://www.github.com/ehicks05/cinemang-frontend',
  },
  {
    icon: FaHome,
    url: 'https://ehicks.net',
  },
];

const Footer = () => (
  <footer className="flex justify-end gap-4 p-4">
    {LINKS.map(({ url, icon: Icon }) => (
      <Link href={url} key={url}>
        <Icon className="text-3xl text-green-500 hover:text-green-400" />
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
