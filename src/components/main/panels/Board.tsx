import React, {ChangeEvent, FC, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

type CommonPanelProps = {
  panelId: string;
};

const Board: FC<CommonPanelProps> = ({panelId}) => {
  return <div></div>;
};

export default React.memo(Board);
