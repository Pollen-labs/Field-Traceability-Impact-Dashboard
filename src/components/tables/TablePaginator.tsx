import { useMediaQuery } from "@/hooks/ui/useMediaQuery"
import { DESKTOP_BREAKPOINT } from "@/config/constants"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"

/**
 * Interface for the ShowingDisplay component props
 * @property {number} currentPage - The current active page
 * @property {number} totalItemAmount - Total number of items across all pages
 * @property {number} itemsPerPage - Number of items displayed per page
 */
interface IShowingDisplay {
	currentPage: number
	totalItemAmount: number
	itemsPerPage: number
}

/**
 * ShowingDisplay - Component that displays the current range of items being shown
 * 
 * Renders a text indicator showing which items are currently visible, such as:
 * "Showing 1 - 10 of 50 items"
 * 
 * Handles special cases:
 * - Returns null if there are no items
 * - Shows a simplified message for a single item
 * - Calculates the correct range for the current page
 */
const ShowingDisplay = ({
	currentPage,
	totalItemAmount,
	itemsPerPage,
}: IShowingDisplay) => {
	// If there are no items, don't render anything
	if (totalItemAmount === 0) {
		return null
	}
	// Special case for a single item
	if (totalItemAmount === 1) {
		return <p className="text-fluid-sm">Showing 1 item</p>;
	}
	// Calculate and display the current range
	return (
		<p className="text-fluid-sm">
			Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
			{currentPage * itemsPerPage > totalItemAmount
				? totalItemAmount
				: currentPage * itemsPerPage}{" "}
			of {totalItemAmount} items
		</p>
	)
}

/**
 * calculatePaginationRange - Helper function to determine which page numbers to display
 * 
 * Calculates a range of page numbers to show in the pagination control,
 * centered around the current page when possible. This creates a sliding
 * window effect as the user navigates through many pages.
 * 
 * @param {number} currentPage - The current active page
 * @param {number} maxPage - The maximum number of pages available
 * @param {number} maxPagesInPagination - Maximum number of page buttons to display
 * @returns {number[]} Array of page numbers to display
 */
const calculatePaginationRange = (
	currentPage: number,
	maxPage: number,
	maxPagesInPagination: number,
) => {
	// Ensure we don't exceed the maxPage limit
	const totalPages = Math.min(maxPage, maxPagesInPagination)

	// Calculate the start page, trying to center current page in the range
	let startPage = Math.max(currentPage - Math.floor(totalPages / 2), 1)
	let endPage = startPage + totalPages - 1

	// Adjust if endPage goes beyond maxPage
	if (endPage > maxPage) {
		endPage = maxPage;
		// Adjust startPage to ensure we always show the same number of pages
		startPage = Math.max(1, endPage - totalPages + 1)
	}

	// Generate the range of page numbers
	return Array.from(
		{ length: endPage - startPage + 1 },
		(_, index) => startPage + index,
	)
}

/**
 * Interface for the TablePaginator component props
 * @property {boolean} needsPagination - Whether pagination is needed (false for single page)
 * @property {number} currentPage - The current active page
 * @property {number} maxPage - The maximum number of pages available
 * @property {(pageNum: number) => void} loadPage - Function to call when a page is selected
 */
interface ITablePaginator {
	needsPagination: boolean
	currentPage: number
	maxPage: number
	loadPage: (pageNum: number) => void
}

/**
 * TablePaginator - Component that renders pagination controls for tables
 * 
 * Displays a responsive pagination UI with:
 * - Previous/Next buttons
 * - Page number buttons
 * - Adaptive number of visible page buttons based on screen size
 * - Proper disabled states for boundary conditions
 * 
 * The component automatically adjusts the visible page numbers to create
 * a sliding window centered around the current page.
 */
const TablePaginator = ({
	needsPagination,
	currentPage,
	maxPage,
	loadPage,
}: ITablePaginator) => {
	// Use responsive behavior based on screen size
	const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)
	// Show more page numbers on desktop for better navigation
	const maxPagesInPagination = isDesktop ? 7 : 5
	// Don't render pagination if not needed (e.g., single page)
	if (!needsPagination) {
		return null
	}

	// Calculate which page numbers to display
	const pagesInPagination = calculatePaginationRange(
		currentPage,
		maxPage,
		maxPagesInPagination,
	)

	return (
		<Pagination className="pt-10 md:pt-2">
			<PaginationContent>
        {/* Previous page button */}
				<PaginationItem className="hover:cursor-pointer">
					<PaginationPrevious
						onClick={() => (currentPage > 1 ? loadPage(currentPage - 1) : null)}
						className={cn(
							buttonVariants({ variant: "secondary", size: "sm" }),
							"hover:bg-ocean",
							currentPage === 1
								? "cursor-not-allowed opacity-30 hover:bg-ocean focus:bg-none"
								: "",
						)}
					/>
				</PaginationItem>

        {/* Page number buttons */}
				{pagesInPagination.map((pageNum, index) => (
					<PaginationItem
						onClick={() => loadPage(pageNum)}
						className="hover:cursor-pointer"
						key={`page-${pageNum}`}
					>
						<PaginationLink isActive={currentPage === pageNum}>
							{pageNum}
						</PaginationLink>
					</PaginationItem>
				))}

        {/* Next page button */}
				<PaginationItem className="hover:cursor-pointer">
					<PaginationNext
						onClick={() =>
							currentPage < maxPage ? loadPage(currentPage + 1) : null
						}
						className={cn(
							buttonVariants({ variant: "secondary", size: "sm" }),
							"hover:bg-ocean",
							currentPage === maxPage
								? "cursor-not-allowed opacity-30 hover:bg-ocean focus:bg-none"
								: "",
						)}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export { ShowingDisplay, TablePaginator }