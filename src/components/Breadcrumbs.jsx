import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LuChevronRight, LuHouse } from 'react-icons/lu';

const Breadcrumbs = ({ customPaths }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className="mb-4 reveal">
      <ol className="breadcrumb mb-0 align-items-center">
        <li className="breadcrumb-item d-flex align-items-center">
          <Link to="/" className="text-gold opacity-50 text-decoration-none hvr-grow">
            <LuHouse size={14} />
          </Link>
          <LuChevronRight className="mx-2 text-white opacity-10" size={12} />
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          const label = customPaths && customPaths[index] ? customPaths[index] : value;
          
          return last ? (
            <li key={to} className="breadcrumb-item active text-white smallest fw-bold text-uppercase letter-spacing-1" aria-current="page">
              {label.replace(/-/g, ' ')}
            </li>
          ) : (
            <li key={to} className="breadcrumb-item d-flex align-items-center">
              <Link to={to} className="text-gold opacity-50 text-decoration-none smallest fw-bold text-uppercase letter-spacing-1 hvr-grow">
                {label.replace(/-/g, ' ')}
              </Link>
              <LuChevronRight className="mx-2 text-white opacity-10" size={12} />
            </li>
          );
        })}
      </ol>
      <style>{`
        .breadcrumb-item + .breadcrumb-item::before { display: none; }
        .text-gold { color: var(--pvr-gold); }
        .smallest { font-size: 0.65rem; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .hvr-grow { transition: transform 0.2s ease; display: inline-block; }
        .hvr-grow:hover { transform: scale(1.1); opacity: 1 !important; }
      `}</style>
    </nav>
  );
};

export default Breadcrumbs;
