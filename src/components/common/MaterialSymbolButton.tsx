import React, {FC} from 'react';
import {MaterialSymbol} from 'react-material-symbols';

export type MaterialSymbolButtonProps = {
  icon: any;
  handleClick?: () => void;
};

const MaterialSymbolButton: FC<MaterialSymbolButtonProps> = ({
  icon,
  handleClick
}) => {
  return (
    <button className="btn btn-ghost btn-circle" onClick={handleClick}>
      <MaterialSymbol icon={icon} size={36} grade={-25} />
    </button>
  );
};

export default React.memo(MaterialSymbolButton);
