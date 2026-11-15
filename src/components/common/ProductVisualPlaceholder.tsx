import React from 'react';
import { Product } from '../../types/index.ts';
import {
  Cctv,
  Sun,
  Move3d,
  Camera,
  BellRing,
  Router,
  Activity,
  Plug,
} from 'lucide-react';

interface ProductVisualPlaceholderProps {
  product: Product;
  size?: 'card' | 'detail';
}

export const ProductVisualPlaceholder: React.FC<ProductVisualPlaceholderProps> = ({
  product,
  size = 'card',
}) => {
  const sub = (product.subcategory || product.category || '').toLowerCase();

  const getVisualStyle = () => {
    if (sub.includes('solar') || sub.includes('battery')) {
      return {
        icon: <Sun className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-amber-600 bg-amber-50 border-amber-200/80',
        label: 'Solar / Battery Security',
      };
    }
    if (sub.includes('pan-tilt')) {
      return {
        icon: <Move3d className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-blue-600 bg-blue-50 border-blue-200/80',
        label: 'Pan & Tilt Series',
      };
    }
    if (sub.includes('doorbell')) {
      return {
        icon: <BellRing className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-[#111318] bg-slate-100 border-slate-300/80',
        label: 'Video Doorbell',
      };
    }
    if (sub.includes('indoor')) {
      return {
        icon: <Camera className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-blue-700 bg-blue-50 border-blue-200/80',
        label: 'Indoor Camera',
      };
    }
    if (sub.includes('hub')) {
      return {
        icon: <Router className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-[#111318] bg-slate-100 border-slate-300/80',
        label: 'Smart Hub / Storage',
      };
    }
    if (sub.includes('sensor')) {
      return {
        icon: <Activity className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
        label: 'Smart Sensor',
      };
    }
    if (sub.includes('power') || sub.includes('lighting')) {
      return {
        icon: <Plug className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
        accent: 'text-emerald-600 bg-emerald-50 border-emerald-200/80',
        label: 'Power & Lighting',
      };
    }
    return {
      icon: <Cctv className={size === 'detail' ? 'w-14 h-14' : 'w-10 h-10'} />,
      accent: 'text-red-700 bg-red-50 border-red-200/80',
      label: 'Outdoor CCTV',
    };
  };

  const { icon, accent, label } = getVisualStyle();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative select-none px-4">
      <div
        className={`rounded-2xl border flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-105 ${accent} ${
          size === 'detail' ? 'w-28 h-28' : 'w-20 h-20'
        }`}
      >
        {icon}
      </div>
      <div className="mt-3 text-center">
        <div
          className={`font-mono font-bold tracking-tight text-slate-800 ${
            size === 'detail' ? 'text-base' : 'text-xs'
          }`}
        >
          {product.model || product.name}
        </div>
        <div
          className={`text-slate-500 font-medium mt-0.5 ${
            size === 'detail' ? 'text-xs' : 'text-[10px]'
          }`}
        >
          {product.resolution || label}
        </div>
      </div>
    </div>
  );
};
