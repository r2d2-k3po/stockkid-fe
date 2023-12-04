import {MaterialSymbol} from 'react-material-symbols';
import React, {FC} from 'react';

type MaterialSymbolProps = {
  size: number;
};

const MaterialSymbolSuccess: FC<MaterialSymbolProps> = ({size}) => {
  return (
    <div className="text-success animate-bounce">
      <MaterialSymbol icon="check_circle" size={size} grade={-25} />
    </div>
  );
};

export default React.memo(MaterialSymbolSuccess);
