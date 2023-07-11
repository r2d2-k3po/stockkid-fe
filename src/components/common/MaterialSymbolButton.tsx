import React, {FC} from 'react';
import {MaterialSymbol} from 'react-material-symbols';

export type MaterialSymbolButtonProps = {
  icon: any;
};

const MaterialSymbolButton: FC<MaterialSymbolButtonProps> = ({icon}) => {
  return (
    <div className="btn btn-ghost btn-circle">
      <MaterialSymbol icon={icon} size={36} grade={-25} />
    </div>
  );
};

export default React.memo(MaterialSymbolButton);
