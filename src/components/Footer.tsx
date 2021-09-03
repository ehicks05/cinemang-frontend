import React, { FC } from "react";

const REPO_URL = "https://www.github.com/hicks-team/arc/";
const SITE_URL = "https://ehicks.net";

const Footer = () => {
  return (
    <footer className="flex justify-end p-4 gap-4">
      <Link href={REPO_URL}>github</Link>
      <Link href={SITE_URL}>ehicks</Link>
    </footer>
  );
};

interface Props {
  href: string;
}

const Link: FC<Props> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-blue-400 hover:underline hover:text-blue-600 visited:text-purple-600"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export default React.memo(Footer);
