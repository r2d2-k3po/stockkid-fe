import React from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {redirect} from 'react-router-dom';
import Main from './components/main/Main';

export const loader = ({request}: {request: Request}) => {
  const currentScreen = localStorage.getItem('currentScreen') || '1';
  if (new URL(request.url).pathname === '/') {
    return redirect(`/screen/${currentScreen}`);
  }
  return null;
};

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Header />
      <Main />
      <Footer />
    </DndProvider>
  );
}
