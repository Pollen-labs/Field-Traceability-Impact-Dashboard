import { useState, useMemo } from 'react';
import { useMediaQuery } from "@/hooks/ui/useMediaQuery"
import { usePagination } from "@/hooks/ui/usePagination"
import { DESKTOP_BREAKPOINT, ITEMS_PER_PAGE } from "@/config/constants"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ShowingDisplay, TablePaginator } from "@/components/tables/TablePaginator"
import { Link, ArrowUpRight, ArrowUpDown } from 'lucide-react'
import { TableSkeleton } from "@/components/global/TableSkeleton"

// --- Type Definitions ---
// Defines the structure for configuring table columns
export interface ColumnDef<T> {
  id: string; // Unique identifier for the column (can be keyof T)
  header: React.ReactNode; // Content for the header cell
  cell: (item: T) => React.ReactNode; // Function to render the body cell content
  width?: string; // Tailwind width class (e.g., 'w-[25%]')
  isSortable?: boolean;
  // Optional accessor function to get the value used specifically for sorting
  sortAccessor?: (item: T) => string | number | Date | undefined | null;
}

// Defines the structure for sorting state
interface SortConfig {
  key: string | null;
  direction: 'ascending' | 'descending';
}
// --- End Type Definitions ---

// --- Component Props Interface ---
// Uses a generic type T, constrained to have an id and optionally a timestamp
interface AttestationsTableProps<T extends { id: string | number, timestamp?: string }> {
  data: T[]; // The data array to display
  columns: ColumnDef<T>[]; // Configuration for table columns
  renderMobileCard: (item: T) => React.ReactNode; // Function to render a card on mobile
  isLoading?: boolean; // Optional loading state indicator
  error?: Error | null; // Optional error object
  totalRecords: number; // Total number of records for pagination display
  // Optional: Add initial sort configuration if needed later
  // initialSortKey?: string;
  // initialSortDirection?: 'ascending' | 'descending';
}
// --- End Component Props Interface ---

/**
 * AttestationsTable - Generic component to display attestation-like data in a table or card view.
 *
 * Renders a responsive table (desktop) or list of cards (mobile) based on provided data and configuration.
 *
 * Features:
 * - Generic: Works with different data types (T).
 * - Configurable Columns: Table columns are defined via the `columns` prop.
 * - Custom Mobile View: Mobile card appearance is defined via the `renderMobileCard` prop.
 * - Sorting: Supports sorting by a specified column (defaults to 'timestamp' if available and sortable).
 * - Pagination: Handles pagination internally.
 * - Loading/Error/Empty States: Displays appropriate messages based on props.
 */

// --- Utility Function ---
const getAttestationUrl = (id: string | number): string => {
  // Assuming Optimism Etherscan for attestations
  return `https://optimism.easscan.org/attestation/view/${id}`;
};
// --- End Utility Function ---

const AttestationsTable = <T extends { id: string | number, timestamp?: string }>({
  data: initialData,
  columns,
  renderMobileCard,
  isLoading = false,
  error = null,
  totalRecords,
}: AttestationsTableProps<T>) => {
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)
  const itemsPerPage = isDesktop ? ITEMS_PER_PAGE.DESKTOP : ITEMS_PER_PAGE.MOBILE

  // --- Sorting State and Logic ---
  // Find the default sort column ('actionDate' or the first sortable one)
  const defaultSortColumnId = columns.find(c => c.id === 'actionDate' && c.isSortable)?.id 
                             || columns.find(c => c.isSortable)?.id 
                             || null;
                             
  const [sortConfig, setSortConfig] = useState<SortConfig>({
     key: defaultSortColumnId, // Default sort by 'actionDate' if possible
     direction: 'descending' 
  });

  const sortedData = useMemo(() => {
    let sortableItems = [...initialData];
    if (sortConfig.key !== null) {
      const sortColumn = columns.find(col => col.id === sortConfig.key);
      // Use sortAccessor if provided, otherwise try to access property directly
      const accessor = sortColumn?.sortAccessor || ((item: T) => item[sortConfig.key as keyof T] as any);
      
      if (sortColumn?.isSortable) {
        sortableItems.sort((a, b) => {
          const valA = accessor(a);
          const valB = accessor(b);

          // Handle potential null/undefined values for robust sorting
          if (valA == null && valB == null) return 0;
          if (valA == null) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (valB == null) return sortConfig.direction === 'ascending' ? 1 : -1;

          // Comparison logic
          if (valA < valB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (valA > valB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
    }
    return sortableItems;
  }, [initialData, columns, sortConfig]);

  // Handler to request sorting on a column
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } // Otherwise, default to ascending for a new key or toggled descending
    setSortConfig({ key, direction });
  };
  // --- End Sorting State and Logic ---

  // --- Pagination Hook (uses sorted data) ---
  const {
    currentPage,
    currentPageItems, // Renamed from pageTransactions
    loadPage,
    maxPage,
    needsPagination,
  } = usePagination(sortedData, itemsPerPage); // Use sortedData for pagination
  // --- End Pagination Hook ---

  // --- Loading/Error/Empty State Rendering ---
  if (isLoading) {
    return <TableSkeleton rowCount={5} columnCount={columns.length} />;
  }

  if (error) {
    return (
      <article className="w-full min-h-[400px] lg:min-h-[598px] flex flex-col justify-center items-center text-center text-fluid-lg px-10">
        <p>Sorry! We are not able to build the attestation table at this time.</p>
        <img src="/illustrations/dolphin.svg" alt="error illustration" className="w-[300px] h-[300px] opacity-50" loading="lazy" />
      </article>
    );
  }

  if (!isLoading && !error && sortedData.length === 0) {
     return (
      <article className="w-full min-h-[400px] lg:min-h-[598px] flex flex-col justify-center items-center text-center text-fluid-lg px-10">
        <p>There are no attestations matching the current criteria.</p>
        <img src="/illustrations/dolphin.svg" alt="empty state illustration" className="w-[300px] h-[300px] opacity-50" loading="lazy" />
      </article>
    );
  }
  // --- End Loading/Error/Empty State Rendering ---

  // --- Main Render Logic ---
  return (
    <>
      <div className="flex flex-col gap-4">
        <article className="min-h-[450px] lg:min-h-[550px]">
          <p className="font-semibold py-2">Total attestations: {totalRecords}</p>

          {isDesktop ? (
            <Table className="w-full table-fixed border-separate border-spacing-y-2">
              <TableHeader>
                <TableRow className="border-none">
                    <td colSpan={columns.length} className="p-0">
                        {/* Header Wrapper: background, border, rounding */}
                        <div className="flex w-full bg-sand border border-darkSand rounded-full overflow-hidden">
                            {columns.map((column, index) => {
                                const isLast = index === columns.length - 1;
                                const borderClass = !isLast ? "border-r border-r-darkSand" : "";

                                return (
                                    <div 
                                        key={column.id} 
                                        className={`p-0 ${column.width || 'flex-1'} ${borderClass}`} 
                                        onClick={column.isSortable ? () => requestSort(column.id) : undefined}
                                        style={column.isSortable ? { cursor: 'pointer' } : {}}
                                    >
                                        {/* Header Inner Content: padding, alignment, uppercase */}
                                        <div className="text-fluid-xs font-light text-softBlack px-4 lg:px-6 py-2 flex items-center justify-between h-full">
                                            <span className="uppercase">{column.header}</span> {/* Make header uppercase */}
                                            {column.isSortable && (
                                                <span className="ml-1">
                                                   <ArrowUpDown size={14} strokeWidth={2} className={`${sortConfig.key === column.id ? 'text-softBlack' : 'text-gray-400'}`} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentPageItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group border-none"
                  >
                    <td colSpan={columns.length} className="p-0">
                       {/* Row Wrapper: Changed to <a> tag, outer border/rounding, hover state */}
                       <a 
                         href={getAttestationUrl(item.id)} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="flex w-full border border-darkSand rounded-full overflow-hidden group-hover:bg-sand transition-colors text-current no-underline hover:text-current" /* Ensure link styling is overridden */
                       >
                           {columns.map((column, index) => {
                                const isLast = index === columns.length - 1;
                                const borderClass = !isLast ? "border-r border-r-darkSand" : "";

                                return (
                                    <div 
                                        key={`${item.id}-${column.id}`} 
                                        className={`align-middle ${column.width || 'flex-1'} ${borderClass}`}
                                    >
                                        {/* Inner Content div: padding, truncation */}
                                        <div className={`h-full px-4 lg:px-6 py-4 truncate`}>
                                            {column.cell(item)}
                                        </div>
                                    </div>
                                );
                           })}
                       </a>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            // --- End Desktop Table View ---
          ) : (
            // --- Mobile Card View ---
            <div className="space-y-3"> {/* Slightly more spacing */}
                {currentPageItems.map((item) => (
                    <div key={item.id}>
                        {renderMobileCard(item)}
                    </div>
                ))}
            </div>
            // --- End Mobile Card View ---
          )}
        </article>

        {/* --- Pagination Controls --- */}
        {needsPagination && (
          <article className="flex flex-col justify-center items-center gap-4">
            <TablePaginator
              needsPagination={needsPagination}
              currentPage={currentPage}
              maxPage={maxPage}
              loadPage={loadPage}
            />
            <ShowingDisplay
              currentPage={currentPage}
              totalItemAmount={totalRecords}
              itemsPerPage={itemsPerPage}
            />
          </article>
        )}
        {/* --- End Pagination Controls --- */}
      </div>
    </>
  );
}

export { AttestationsTable };