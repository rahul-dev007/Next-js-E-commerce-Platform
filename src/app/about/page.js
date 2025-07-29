// src/app/about/page.js
"use client";

import { CheckCircle, Code, Database, Palette, Server, Users, CreditCard } from 'lucide-react';
import Image from 'next/image';

const techStack = [
    { name: 'Next.js', icon: '/tech-icons/nextjs.svg', description: 'For server-side rendering and a seamless React framework.' },
    { name: 'React', icon: '/tech-icons/react.svg', description: 'To build a fast and interactive user interface.' },
    { name: 'Node.js', icon: '/tech-icons/nodejs.svg', description: 'For the powerful and scalable backend runtime.' },
    { name: 'MongoDB', icon: '/tech-icons/mongodb.svg', description: 'As a flexible NoSQL database for storing data.' },
    { name: 'Redux Toolkit', icon: '/tech-icons/redux.svg', description: 'For predictable and centralized state management.' },
    { name: 'NextAuth.js', icon: '/tech-icons/nextauth.png', description: 'For robust and secure user authentication.' },
    { name: 'Stripe', icon: '/tech-icons/stripe.svg', description: 'To handle secure and reliable international payments.' },
    { name: 'Tailwind CSS', icon: '/tech-icons/tailwindcss.svg', description: 'For rapid and modern UI development.' },
    { name: 'Cloudinary', icon: '/tech-icons/cloudinary.svg', description: 'For scalable cloud-based image and video management.' },
];

const features = [
    { icon: Users, title: 'Advanced Role-Based Authentication', description: 'Secure login with credentials, Google, & GitHub. Differentiated access for Users, Admins, and Superadmins.' },
    { icon: Code, title: 'Full-Stack CRUD Operations', description: 'Complete management system for products and users, handled efficiently from the admin panel.' },
    { icon: CreditCard, title: 'International Payment Gateway', description: 'Seamless and secure checkout experience powered by Stripe for customers worldwide.' },
];

export default function AboutPage() {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-gray-900 to-sky-900 text-white text-center py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold">About This Project</h1>
                    <p className="mt-4 text-lg text-sky-200 max-w-3xl mx-auto">
                        This is a comprehensive case study of MyAuthApp, a production-ready full-stack e-commerce platform built from scratch.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 space-y-20">
                {/* My Role Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">My Role: Sole Full-Stack Developer</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                            As the sole developer on this project, I was responsible for the entire product lifecycle, from initial concept to deployment. This involved architecting the backend, designing the database schema, building a secure API, and creating a beautiful, responsive user interface.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4"><Palette className="text-indigo-500"/><span>UI/UX Design & Frontend Development</span></li>
                            <li className="flex items-center gap-4"><Server className="text-green-500"/><span>Backend API Development</span></li>
                            <li className="flex items-center gap-4"><Database className="text-yellow-500"/><span>Database Architecture & Management</span></li>
                        </ul>
                    </div>
                </section>
                
                {/* Core Features Section */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-12">Core Architectural Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map(feature => (
                            <div key={feature.title} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                                <feature.icon className="mx-auto h-12 w-12 text-indigo-500" />
                                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technology Stack Section */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-12">Technology Stack</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                        {techStack.map(tech => (
                             <div key={tech.name} className="flex flex-col items-center text-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition">
                                <Image src={tech.icon} alt={`${tech.name} logo`} width={48} height={48} />
                                <p className="mt-4 font-semibold">{tech.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}