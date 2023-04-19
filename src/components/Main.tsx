import React from 'react';
import VirtualScreen from './VirtualScreen';

export default function Main() {
  return (
    <div>
      <div className="carousel w-full">
        <div id="item1" className="carousel-item w-full">
          <VirtualScreen />
        </div>
        <div id="item2" className="carousel-item w-full">
          <VirtualScreen />
        </div>
        <div id="item3" className="carousel-item w-full">
          <VirtualScreen />
        </div>
        <div id="item4" className="carousel-item w-full">
          <VirtualScreen />
        </div>
      </div>
      <div className="flex justify-center w-full py-2 gap-2">
        <a href="#item1" className="btn btn-xs">
          1
        </a>
        <a href="#item2" className="btn btn-xs">
          2
        </a>
        <a href="#item3" className="btn btn-xs">
          3
        </a>
        <a href="#item4" className="btn btn-xs">
          4
        </a>
      </div>
    </div>
  );
}
