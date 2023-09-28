import React from 'react';
import {MaterialSymbol} from 'react-material-symbols';

const MaterialSymbolError = () => {
  return (
    <div className="text-error animate-ping">
      <MaterialSymbol icon="warning" size={36} grade={-25} />
    </div>
  );
};

export default React.memo(MaterialSymbolError);
