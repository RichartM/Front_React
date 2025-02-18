import React from 'react'

import { Pagination } from 'react-bootstrap';
const BootstrapPagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
                onClick={() => onPageChange("prev")}
                disabled={currentPage === 1}
            />
            {pages.map((page) => (
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => onPageChange("next")}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    );
};
export default BootstrapPagination;