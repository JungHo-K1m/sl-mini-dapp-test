import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';

interface PageHeaderProps {
  title: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, className }) => {
  const navigate = useNavigate();

  return (
    <header
      className={`h-14 grid grid-cols-6  items-center justify-center font-bold text-xl mb-8 ${className}`}
    >
      <div className=' col-span-1 flex items-center'>
      <button onClick={() => navigate(-1)}>
        <IoChevronBackOutline className="w-6 h-6" />
      </button>
      </div>
      <div className='col-span-4 flex justify-center'>
      <p>{title}</p>
      </div>
      <span> </span>
    </header>
  );
};

export default PageHeader;
