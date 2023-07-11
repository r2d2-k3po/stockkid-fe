import React from 'react';

export function visibleRefHiddenRef(
  ref1: React.RefObject<HTMLDivElement>,
  ref2: React.RefObject<HTMLDivElement>
) {
  ref1.current?.setAttribute('class', 'visible');
  ref2.current?.setAttribute('class', 'hidden');
}
