import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface CardLayoutProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  infoText?: string;
}

const CardLayout: React.FC<CardLayoutProps> = ({ title, icon, children, infoText }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <h2 className="font-semibold text-slate-800">{title}</h2>
          </div>
          {infoText && (
            <div className="relative group">
              <Info className="h-4 w-4 text-slate-400 cursor-help" />
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {infoText}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default CardLayout;