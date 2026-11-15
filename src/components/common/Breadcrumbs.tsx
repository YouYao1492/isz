import React from 'react';
import { useCatalog } from '../../context/CatalogContext.tsx';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate } = useCatalog();

  return (
    <nav aria-label="Breadcrumb" className="py-3 px-1">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500">
        <li className="flex items-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 hover:text-red-700 transition-colors"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {item.path && !isLast ? (
                <button
                  type="button"
                  onClick={() => navigate(item.path!)}
                  className="hover:text-red-700 transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </button>
              ) : (
                <span className="font-semibold text-slate-800 truncate max-w-[240px]" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
