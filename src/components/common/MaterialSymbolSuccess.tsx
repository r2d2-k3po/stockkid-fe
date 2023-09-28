import {MaterialSymbol} from 'react-material-symbols';
import React from 'react';

const MaterialSymbolSuccess = () => {
  return (
    <div className="text-success animate-bounce">
      <MaterialSymbol icon="check_circle" size={36} grade={-25} />
    </div>
  );
};

export default React.memo(MaterialSymbolSuccess);
