import React from 'react';

export function invisibleRefVisibleRef(
  ref1: React.RefObject<HTMLDivElement>,
  ref2: React.RefObject<HTMLDivElement>
) {
  ref1.current?.setAttribute('class', 'invisible');
  ref2.current?.setAttribute('class', 'visible');
}
