// PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PublicRoute({ children }) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/Home" replace />;
    }

    return children;
}