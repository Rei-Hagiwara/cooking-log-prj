import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { LoginPage } from './pages/LoginPage';
import { PostListPage } from "./pages/PostListPage";
import { PostFormPage } from "./pages/PostFormPage";

const router = createBrowserRouter([
    {
        // 認証なし
        path: '/login',
        element: <LoginPage />,
    },
    {
        // 認証あり
        element: <RequireAuth />,
        children: [
            {
                path: '/',
                element: <PostListPage />
            },
            {
                path: '/new',
                element: <PostFormPage />
            },
        ],
    },
]);

export function Router() {
    return <RouterProvider router={router} />;
}
