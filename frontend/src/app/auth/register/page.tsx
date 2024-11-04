'use client';

import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {toast} from 'sonner';
import {useRouter} from "next/navigation";
import {publicAxios} from "@/lib/axiosInstance";
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {FiEye, FiEyeOff} from 'react-icons/fi'; // Import icons

const Register = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            router.push('/dashboard');
        }
    }, [router]);

    const initialValues = {
        username: '',
        email: '',
        password: '',
        profile: {
            phone_number: '',
            address: '',
            pincode: '',
        },
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
        profile: Yup.object().shape({
            phone_number: Yup.string().required('Phone number is required'),
            address: Yup.string(),
            pincode: Yup.string().required('Pincode is required'),
        }),
    });

    const onSubmit = async (data: any) => {
        try {
            await publicAxios.post('/users/register/', data);
            toast.success('Registration successful!');
            router.push('/auth/login');
        } catch (error: any) {
            console.error(error);
            if (error.response && error.response.data.username) {
                toast.error(error.response.data.username[0]);
            } else {
                toast.error('Registration failed. Please check your details.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {() => (
                        <Form>
                            <div className="mb-4">
                                <Field
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <div className="mb-4">
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <div className="mb-4 relative">
                                <Field
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Password"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff/> : <FiEye/>} {/* Toggle icon */}
                                </button>
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <div className="mb-4">
                                <Field
                                    type="text"
                                    name="profile.phone_number"
                                    placeholder="Phone Number"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <ErrorMessage name="profile.phone_number" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <div className="mb-4">
                                <Field
                                    type="text"
                                    name="profile.address"
                                    placeholder="Address"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <ErrorMessage name="profile.address" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <div className="mb-4">
                                <Field
                                    type="text"
                                    name="profile.pincode"
                                    placeholder="Pincode"
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                                <ErrorMessage name="profile.pincode" component="div" className="text-red-500 text-sm mt-1"/>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                            >
                                Register
                            </button>
                        </Form>
                    )}
                </Formik>
                <div className="mt-4 text-center">
                    <Link href="/auth/login" className="text-blue-500 hover:underline">
                        Already have an account? Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
