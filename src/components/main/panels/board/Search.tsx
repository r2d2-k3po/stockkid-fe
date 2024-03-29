import React, {FC} from 'react';

type SearchProps = {
  searchMode: boolean;
  searchDisabled: boolean;
};

const Search: FC<SearchProps> = ({searchMode, searchDisabled}) => {
  return (
    <button
      disabled={searchDisabled}
      className={
        searchMode
          ? 'btn btn-xs btn-outline btn-info btn-circle btn-active'
          : 'btn btn-xs btn-outline btn-info btn-circle'
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
};

export default React.memo(Search);
