import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import PropagateLoader from "react-spinners/PropagateLoader";
import useAdminProvide from '../../hooks/useAdminProvide/useAdminProvide';

const AdminRoutes = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, isAdminLoading] = useAdminProvide(user?.email);
    const location = useLocation();
    if (loading || isAdminLoading) {
        return <>
            <div className='row'>
                <div className='col  d-flex justify-content-center align-items-center' style={{ height: "35rem" }}>
                    <PropagateLoader color="#36d7b7" />
                </div>
            </div>
        </>
    }
    if (user && isAdmin) {
        return children
    }
    return <Navigate to={'/login'} state={{ form: location }} replace></Navigate>;
};

export default AdminRoutes;