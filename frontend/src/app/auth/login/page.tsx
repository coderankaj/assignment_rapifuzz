'use client';

import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'sonner';
import {useRouter} from 'next/navigation';
import {publicAxios} from "@/lib/axiosInstance";
import Link from 'next/link';
import {useEffect} from "react";
import {useAuth} from "@/context/AuthContext";

const Login: React.FC = () => {
    const router = useRouter();
    const {login} = useAuth();

    const initialValues = {
        username: '',
        password: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            router.push('/incidents');
            return;
        }
    }, [router]);


    const onSubmit = async (data: { username: string; password: string }) => {
        try {
            // Make the login request
            const response = await publicAxios.post('/users/login/', data);
            const {token} = response.data;

            // Set the token in local storage
            localStorage.setItem('authToken', token);
            login(); // Call the login method from context

            toast.success('Login successful!'); // Success toast
            router.push('/incidents'); // Redirect after login
        } catch (error: any) {
            console.error(error);
            // Check if the error response has a specific message
            if (error?.response && error?.response?.data && error?.response?.data?.error) {
                toast.error(error.response.data.error); // Show the specific error message
            } else {
                toast.error('Login failed. Please check your credentials.'); // General error message
            }
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {() => (
                        <Form>
                            <div className="mb-4">
                                <Field
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <div className="mb-4">
                                <Field
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1"/>
                                <div className="flex justify-end">
                                    <Link href="/auth/forgot-password" className="text-blue-500 hover:underline text-sm mt-1">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                            >
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
