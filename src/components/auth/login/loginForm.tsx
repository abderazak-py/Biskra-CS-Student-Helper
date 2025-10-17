"use client";

import { useState } from "react";
import Image from "next/image";
import LoginImage from "../../../../public/images/login-image.jpg";
import { LoginAPI } from "@/service/api/auth/login";
import {AuthenticationResponse} from "@/model/authModel";
import {Metadata} from "next"; // your typed API


export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent page reload
        setLoading(true);
        setError(null);

        try {
            const response:AuthenticationResponse = await LoginAPI.login({ email, password });
            console.log(response);
            localStorage.setItem("token", response.access_token);
            document.cookie = `token=${response.access_token}; path=/; max-age=86400; secure; samesite=strict`;
            window.location.href = "/dashboard";
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Image */}
            <div className="hidden md:flex items-center relative justify-center bg-gray-100 dark:bg-muted">
                <Image src={LoginImage} alt="Login illustration" className="object-cover h-full w-full" />
                <div className="absolute left-0 top-0 w-full h-full bg-primary/40" />
                <div className="absolute left-3 bottom-16 display-large-em text-white">
                    Learning made <br />simple and accessible.
                </div>
            </div>

            {/* Login Form with Gradient Effects on Sides */}
            <div className="flex items-center justify-center p-8 bg-background relative overflow-hidden">
                {/* Gradient Effect - Left Side */}
                <div className="absolute left-0 bottom-0 w-full h-full " />
                <div className="z-20 w-full max-w-md space-y-6">
                    <h1 className="headline-large">Log In</h1>
                    <p className="body-medium text-muted-foreground">
                        Enter your email and password to access your account.
                    </p>
                    {error && <p className="text-destructive body-small">{error}</p>}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="label-medium block mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-3 py-2 border rounded-md body-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label-medium block mb-1">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border rounded-md body-medium focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <p className="body-small text-muted-foreground mt-1">
                                Password must be at least 8 characters.
                            </p>
                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-primary text-primary-foreground rounded-md label-large-em hover:bg-primary/90 transition"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}