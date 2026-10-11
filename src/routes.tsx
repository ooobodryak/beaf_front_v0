import { createBrowserRouter } from 'react-router';
import { New } from './pages/New';

export const routes = createBrowserRouter([
  { path: '/', element: <div>Лента.</div> },
  { path: '/new', element: <New /> }
]);
