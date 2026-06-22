import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-nexus reveal">
      <button 
        className={`page-link-nexus ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <LuChevronLeft size={16} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          className={`page-link-nexus ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page.toString().padStart(2, '0')}
        </button>
      ))}

      <button 
        className={`page-link-nexus ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <LuChevronRight size={16} />
      </button>
      
      <div className="ms-3 d-flex align-items-center">
        <span className="text-gold smallest fw-bold text-uppercase letter-spacing-1 opacity-50 px-3 border-start border-white border-opacity-10">
          Telemetry Page {currentPage} of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Pagination;
