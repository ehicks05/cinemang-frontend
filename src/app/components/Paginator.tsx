import React, { FC, ReactNode } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import usePagination from 'headless-pagination-react';
import { PaginatorLink } from 'headless-pagination';

const nf = Intl.NumberFormat('en-US');

interface PaginatorProps {
  count: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
}
const Paginator: FC<PaginatorProps> = ({ pageSize, page, setPage, count }) => {
  const { links, hasNext, hasPrevious, from, to } = usePagination({
    initialPage: page + 1,
    maxLinks: 7,
    perPage: pageSize,
    totalItems: count,
  });

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-gray-800 p-4 sm:flex-row">
      <div>{`Showing ${from}-${Math.min(to, count)} of ${nf.format(
        count,
      )} films`}</div>
      <div className="flex -space-x-px">
        <Link
          link={{ active: false, disabled: !hasPrevious, label: '' }}
          page={page}
          prev
          setPage={setPage}
        >
          <FaChevronLeft className="my-auto text-sm" />
        </Link>
        {links.map((link, i) => (
          <Link key={i} link={link} page={page} setPage={setPage}>
            {link.label}
          </Link>
        ))}
        <Link
          link={{ active: false, disabled: !hasNext, label: '' }}
          next
          page={page}
          setPage={setPage}
        >
          <FaChevronRight className="my-auto text-sm" />
        </Link>
      </div>
    </div>
  );
};

interface LinkProps {
  children: ReactNode;
  link: PaginatorLink;
  next?: boolean;
  page: number;
  prev?: boolean;
  setPage: (page: number) => void;
}
const Link: FC<LinkProps> = ({ page, setPage, link, prev, next, children }) => {
  const newPage = prev ? page - 1 : next ? page + 1 : Number(link.label) - 1;
  const onClick = link.disabled ? undefined : () => setPage(newPage);
  return (
    <div
      className={`flex border border-solid border-gray-500 px-2 sm:px-3 sm:py-1 ${
        link.disabled ? 'opacity-60' : 'cursor-pointer'
      } ${!link.disabled && !link.active ? 'hover:bg-gray-700' : undefined} ${
        link.active ? 'z-10 border-green-500 bg-green-700' : undefined
      } ${prev ? 'rounded-l-md px-1' : undefined} ${
        next ? 'rounded-r-md px-1' : undefined
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Paginator;
