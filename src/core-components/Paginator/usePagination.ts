interface Params {
	currentPage: number;
	linkCount: number;
	pageSize: number;
	totalItems: number;
}

export const usePagination = ({
	currentPage,
	linkCount,
	pageSize,
	totalItems,
}: Params) => {
	const totalPages = Math.ceil(totalItems / pageSize);

	const previousPage = currentPage - 1;
	const nextPage = currentPage + 1;

	const hasPreviousPage = previousPage >= 0;
	const hasNextPage = nextPage < totalPages;

	// if `currentPage` is near the end, start further back to make up for it
	const delta = Math.floor(linkCount / 2);
	const upcomingPages = totalPages - currentPage;
	const extraLookback = Math.max(delta - upcomingPages, 0);

	const firstPageIndex = Math.max(
		currentPage - Math.floor(linkCount / 2) - extraLookback,
		0,
	);
	const forwardDelta = linkCount - (currentPage - firstPageIndex);
	const lastPageIndex = Math.min(currentPage + forwardDelta - 1, totalPages - 1);

	const firstResultIndex = currentPage * pageSize;
	const lastResultIndex = Math.min(
		currentPage * pageSize + pageSize - 1,
		totalItems - 1,
	);

	return {
		firstPageIndex,
		firstResultIndex,
		hasNextPage,
		hasPreviousPage,
		lastPageIndex,
		lastResultIndex,
		nextPage,
		previousPage,
		totalPages,
	};
};
