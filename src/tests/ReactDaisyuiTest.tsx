import {Theme, Button} from 'react-daisyui';
import React from 'react';

export default function ReactDaisyuiTest() {
  return (
    <div>
      <h2>ReactDaisyuiTest</h2>
      <Theme dataTheme="dark">
        <Button color="primary">Click me, dark!</Button>
      </Theme>

      <Theme dataTheme="light">
        <Button color="primary">Click me, light!</Button>
      </Theme>
    </div>
  );
}
