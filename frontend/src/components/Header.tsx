// components/Header.tsx
'use client';

import {useRouter} from 'next/navigation';
import {FiLogIn, FiLogOut, FiUserPlus} from 'react-icons/fi';
import {useAuth} from '@/context/AuthContext';

const Header = () => {
    const router = useRouter();
    const {isAuthenticated, logout} = useAuth();

    const handleLogout = () => {
        logout(); // Use context logout
        router.push('/auth/login'); // Redirect to login
    };


    return (
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <h1 className="text-2xl font-bold">Incident Tracker</h1>
            <nav>
                <ul className="flex space-x-6">
                    {!isAuthenticated ? (
                        <>
                            <li>
                                <button
                                    onClick={() => router.push('/auth/login')}
                                    className="flex items-center bg-blue-600 hover:bg-blue-700 transition duration-200 px-4 py-2 rounded-lg shadow-md"
                                >
                                    <FiLogIn className="mr-2"/>
                                    Login
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => router.push('/auth/register')}
                                    className="flex items-center bg-green-600 hover:bg-green-700 transition duration-200 px-4 py-2 rounded-lg shadow-md"
                                >
                                    <FiUserPlus className="mr-2"/>
                                    Register
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="flex items-center bg-red-600 hover:bg-red-700 transition duration-200 px-4 py-2 rounded-lg shadow-md"
                            >
                                <FiLogOut className="mr-2"/>
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
