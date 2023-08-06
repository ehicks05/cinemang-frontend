import React, { FC, ReactNode } from 'react';
import P from 'paginator';
import { range } from 'lodash';
import { IoIosPlay, IoIosSkipForward } from 'react-icons/io';
import { PAGE_SIZE } from '../../constants';

const nf = Intl.NumberFormat('en-US');

interface PaginatorProps {
  count?: number;
  isLoading: boolean;
  pageIndex?: number;
  pageSize?: number;
  setPage?: (page: number) => void;
}
const Paginator: FC<PaginatorProps> = ({
  count = 0,
  isLoading,
  pageIndex = 0,
  pageSize = PAGE_SIZE,
  setPage = () => undefined,
}) => {
  const page = pageIndex + 1;
  // Arguments are `per_page` and `length`. `per_page` changes the number of
  // results per page, `length` changes the number of links displayed.
  const paginator = new P(pageSize, 5);

  // Arguments are `total_results` and `current_page`.
  const {
    first_page,
    first_result,
    has_next_page,
    has_previous_page,
    last_page,
    last_result,
    next_page,
    previous_page,
    total_pages,
  } = paginator.build(count, page);

  const links = range(first_page, last_page + 1).map(i => ({
    active: i === page,
    disabled: false,
    label: i,
  }));

  const currentlyShowing = `Showing ${nf.format(first_result + 1)}-${nf.format(
    last_result + 1,
  )} of ${nf.format(count)}`;

  return (
    <div className="bg-gray-800 p-4 sm:rounded-lg">
      <div
        className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${
          isLoading ? 'invisible' : ''
        }`}
      >
        <div>{currentlyShowing}</div>
        <div className="flex -space-x-px">
          <Link
            isCompact
            isDisabled={!has_previous_page}
            isFirst
            setPage={() => setPage(0)}
          >
            <IoIosSkipForward className="my-auto rotate-180" size={20} />
          </Link>
          <Link
            isCompact
            isDisabled={!has_previous_page}
            setPage={() => setPage(previous_page - 1)}
          >
            <IoIosPlay className="my-auto rotate-180" size={20} />
          </Link>
          {links.map(link => (
            <Link
              isActive={link.active}
              key={link.label}
              setPage={() => setPage(link.label - 1)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            isCompact
            isDisabled={!has_next_page}
            setPage={() => setPage(next_page - 1)}
          >
            <IoIosPlay className="my-auto" size={20} />
          </Link>
          <Link
            isCompact
            isDisabled={!has_next_page}
            isLast
            setPage={() => setPage(total_pages - 1)}
          >
            <IoIosSkipForward className="my-auto" size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

interface LinkProps {
  children: ReactNode;
  isActive?: boolean;
  isCompact?: boolean;
  isDisabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  setPage: () => void;
}
const Link: FC<LinkProps> = ({
  isActive,
  isCompact,
  isDisabled,
  setPage,
  isFirst,
  isLast,
  children,
}) => {
  const onClick = isDisabled ? undefined : () => setPage();

  const defaultStyle =
    'flex border border-solid border-gray-500 px-2 sm:px-3 sm:py-1';
  const disabled = isDisabled ? 'opacity-60' : 'cursor-pointer';
  const active = isActive ? 'z-10 border-green-700 bg-green-900' : undefined;
  const notSpecial = !isDisabled && !isActive ? 'hover:bg-gray-700' : undefined;
  const first = isFirst ? 'rounded-l-md' : undefined;
  const last = isLast ? 'rounded-r-md' : undefined;
  const padding = isCompact ? 'px-1 sm:px-1.5' : 'px-2 sm:px-3';

  return (
    <div
      className={`${defaultStyle} ${disabled} ${notSpecial} ${active} ${first} ${last} ${padding}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Paginator;
