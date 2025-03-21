import { useLocation, useSearch } from '@tanstack/react-router';
import { range } from 'lodash-es';
import { FastForward, Play } from 'lucide-react';
import { PAGE_SIZE } from '~/constants/constants';
import { PageLink } from './PageLink';
import { usePagination } from './usePagination';

const nf = Intl.NumberFormat('en-US');

interface Props {
	count?: number;
	isLoading: boolean;
	pageSize?: number;
}

export const Paginator = ({ count = 0, isLoading, pageSize = PAGE_SIZE }: Props) => {
	const { pathname } = useLocation();
	const from = pathname === '/tv' ? '/tv/' : '/films/';
	const search = useSearch({ from });
	const { page: currentPage } = search;

	const {
		firstPageIndex,
		firstResultIndex,
		hasNextPage,
		hasPreviousPage,
		lastPageIndex,
		lastResultIndex,
		nextPage,
		previousPage,
		totalPages,
	} = usePagination({
		currentPage,
		linkCount: 5,
		pageSize,
		totalItems: count,
	});

	const currentlyShowing = `Showing ${nf.format(firstResultIndex + 1)}-${nf.format(
		lastResultIndex + 1,
	)} of ${nf.format(count)}`;

	return (
		<div className="bg-neutral-800 p-4 sm:rounded-lg">
			<div
				className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${
					isLoading ? 'invisible' : ''
				}`}
			>
				<div>{currentlyShowing}</div>
				<div className="flex -space-x-px">
					<PageLink isDisabled={!hasPreviousPage} className="rounded-l" page={0}>
						<FastForward className="my-auto rotate-180" size={16} />
					</PageLink>
					<PageLink isDisabled={!hasPreviousPage} page={previousPage}>
						<Play className="my-auto rotate-180" size={16} />
					</PageLink>
					{range(firstPageIndex, lastPageIndex + 1).map((pageIndex) => (
						<PageLink
							isActive={pageIndex === currentPage}
							key={pageIndex}
							page={pageIndex}
						>
							{pageIndex + 1}
						</PageLink>
					))}
					<PageLink isDisabled={!hasNextPage} page={nextPage}>
						<Play className="my-auto" size={16} />
					</PageLink>
					<PageLink
						isDisabled={!hasNextPage}
						className="rounded-r"
						page={totalPages}
					>
						<FastForward className="my-auto" size={16} />
					</PageLink>
				</div>
			</div>
		</div>
	);
};
