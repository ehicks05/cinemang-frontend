import React, { FC } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import usePagination from "headless-pagination-react";
import { PaginatorLink } from "headless-pagination";

const nf = Intl.NumberFormat('en-US');

interface PaginatorProps {
  pageSize: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}
const Paginator: FC<PaginatorProps> = ({ pageSize, page, setPage, count }) => {
  const { links, hasNext, hasPrevious, from, to } = usePagination({
    totalItems: count,
    initialPage: page + 1,
    perPage: pageSize,
    maxLinks: 7,
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-800 rounded-lg">
      <div>{`Showing ${from}-${Math.min(to, count)} of ${nf.format(count)} films`}</div>
      <div className="flex -space-x-px">
        <Link
          page={page}
          setPage={setPage}
          link={{ active: false, disabled: !hasPrevious, label: "" }}
          prev
        >
          <FaChevronLeft className="my-auto text-sm" />
        </Link>
        {links.map((link, i) => (
          <Link key={i} page={page} setPage={setPage} link={link}>
            {link.label}
          </Link>
        ))}
        <Link
          page={page}
          setPage={setPage}
          link={{ active: false, disabled: !hasNext, label: "" }}
          next
        >
          <FaChevronRight className="my-auto text-sm" />
        </Link>
      </div>
    </div>
  );
};

interface LinkProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  link: PaginatorLink;
  prev?: boolean;
  next?: boolean;
}
const Link: FC<LinkProps> = ({ page, setPage, link, prev, next, children }) => {
  const newPage = prev ? page - 1 : next ? page + 1 : Number(link.label) - 1;
  const onClick = link.disabled ? undefined : () => setPage(newPage);
  return (
    <div
      onClick={onClick}
      className={`flex px-2 sm:px-3 sm:py-1 border border-solid border-gray-500 ${
        link.disabled ? "opacity-60" : "cursor-pointer"
      } ${!link.disabled && !link.active ? "hover:bg-gray-700" : undefined} ${
        link.active ? "z-10 bg-green-700 border-green-500" : undefined
      } ${prev ? "rounded-l-md px-1" : undefined} ${
        next ? "rounded-r-md px-1" : undefined
      }`}
    >
      {children}
    </div>
  );
};

export default Paginator;
