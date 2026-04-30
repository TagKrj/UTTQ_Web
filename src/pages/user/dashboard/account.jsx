import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

export default function Account() {
    const navigate = useNavigate();
    const { logout, loading, error } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/landing', { replace: true });
        } catch {
            // Error is shown below.
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-white shadow">
            <h1 className="text-2xl font-semibold text-gray-800">Tài khoản</h1>
            <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="ml-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
            </button>
            {error ? <p className="ml-4 text-sm text-red-500">{error}</p> : null}
        </div>
    );
}