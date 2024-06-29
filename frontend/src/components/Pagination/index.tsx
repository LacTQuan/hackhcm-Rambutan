import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import React, { useState, useEffect } from "react";

// Define props type
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

const MyPagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Fetch data for the new page here, if necessary
  };

  const handlePrevious = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </PaginationPrevious>
        </PaginationItem>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pageNumber);
                }}
                className={currentPage === pageNumber ? 'active' : ''}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext href="#" onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default MyPagination;