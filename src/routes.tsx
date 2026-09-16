import { createBrowserRouter } from "react-router";

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <div>Лента.</div>,
    },
    {
        path: '/new',
        element: <div>Создание новой записи</div>
    }
]);