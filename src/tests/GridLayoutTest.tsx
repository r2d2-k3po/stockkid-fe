import React from 'react';
import GridLayout from 'react-grid-layout';

const GridLayoutTest = () => {
  const layout = [
    {i: 'a', x: 0, y: 0, w: 2, h: 4, static: true},
    {i: 'b', x: 1, y: 0, w: 6, h: 4, minW: 2, maxW: 4},
    {i: 'c', x: 4, y: 0, w: 2, h: 4}
  ];
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
    >
      <div key="a">abc</div>
      <div key="b">b</div>
      <div key="c">c</div>
      <div>ddddd</div>
    </GridLayout>
  );
};

export default GridLayoutTest;
