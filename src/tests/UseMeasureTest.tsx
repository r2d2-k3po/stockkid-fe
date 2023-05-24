import React from 'react';
import {useMeasure} from 'react-use';

const UseMeasureTest = () => {
  const [ref, {x, y, width, height, top, right, bottom, left}] =
    useMeasure<HTMLDivElement>();

  return (
    <div ref={ref}>
      <div>x: {x}</div>
      <div>y: {y}</div>
      <div>width: {width}</div>
      <div>height: {height}</div>
      <div>top: {top}</div>
      <div>right: {right}</div>
      <div>bottom: {bottom}</div>
      <div>left: {left}</div>
    </div>
  );
};

export default UseMeasureTest;
