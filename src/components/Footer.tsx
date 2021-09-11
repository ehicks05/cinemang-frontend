import React, { FC } from "react";
import { FaGithubSquare, FaHome } from "react-icons/fa";
import { SiThemoviedatabase } from "react-icons/si";

const LINKS = [
  {
    url: "https://www.themoviedb.org",
    icon: SiThemoviedatabase,
  },
  {
    url: "https://www.github.com/ehicks05/cinemang-frontend",
    icon: FaGithubSquare,
  },
  {
    url: "https://ehicks.net",
    icon: FaHome,
  },
];

const Footer = () => {
  return (
    <footer className="flex justify-end p-4 gap-4">
      {LINKS.map((link) => {
        return (
          <Link href={link.url}>
            <link.icon className="text-green-500 hover:text-green-400 text-3xl" />
          </Link>
        );
      })}
    </footer>
  );
};

const Link: FC<{ href: string }> = ({ href, children }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
};

export default React.memo(Footer);
