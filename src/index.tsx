import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './css/react-grid-layout-styles.css';
import './css/react-resizable-styles.css';
import App, {loader as appLoader} from './App';
import reportWebVitals from './reportWebVitals';
import 'react-material-symbols/dist/outlined.css';
import {Provider as ReduxProvider} from 'react-redux';
import store from './app/store';
import './i18n';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import AppError from './components/common/AppError';
import VirtualScreen, {
  loader as virtualScreenLoader
} from './components/main/VirtualScreen';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    loader: appLoader,
    element: <App />,

    errorElement: <AppError />,
    children: [
      {
        errorElement: <AppError />,
        children: [
          {
            path: 'screen/:currentScreen',
            loader: virtualScreenLoader,
            element: <VirtualScreen />
          }
        ]
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
