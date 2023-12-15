import React, {FC} from 'react';
import {MaterialSymbol} from 'react-material-symbols';

type MaterialSymbolProps = {
  size: number;
};

const MaterialSymbolError: FC<MaterialSymbolProps> = ({size}) => {
  return (
    <div className="text-error animate-ping">
      <MaterialSymbol icon="warning" size={size} grade={-25} />
    </div>
  );
};

export default React.memo(MaterialSymbolError);
