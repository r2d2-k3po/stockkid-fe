import React from 'react';
import VirtualScreen from './VirtualScreen';

export default function Main() {
  return (
    <div>
      <div className="sticky top-0 flex justify-start ml-60 py-2 gap-2 w-40">
        <a href="#item1" className="btn btn-xs btn-outline btn-info">
          1
        </a>
        <a href="#item2" className="btn btn-xs btn-outline btn-info">
          2
        </a>
        <button className="btn btn-xs btn-outline btn-info">+</button>
      </div>
      <div className="carousel w-full">
        <div id="item1" className="carousel-item w-full">
          <VirtualScreen />
        </div>
        <div id="item2" className="carousel-item w-full">
          <VirtualScreen />
        </div>
      </div>
    </div>
  );
}
