import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { CgSpinner } from "react-icons/cg";

export default function LoginPage() {
    const { login, loading } = useAuth();


    const [error, setError] = useState<string | null>(null);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setREmemberMe] = useState(false);

    const handleLogIn = async (e: FormEvent) => {
        e.preventDefault();

        setError(null);

        // TODO: Add remember me functionality
        login(credentials)
        .then(() => {
            // Successful login handled by AuthContext
        })
        .catch((err) => {
            setError(err.message);
        })
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-background">
            <div className="min-w-2xs min-h-3xs p-6 bg-secondary rounded-md border flex flex-col items-center justify-center border-black/25">
                <h4 className={`${error ? 'mb-1' : 'mb-6' } font-bold`}>Login</h4>
                {error && <small className='mb-5 text-red-500'>{error}</small>}

                <form onSubmit={handleLogIn} className="flex flex-col mx-2 gap-4">
                    <label className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black/25">
                            <FaUser />
                        </span>
                        
                        <input type="text" className="text-text pl-9 w-full p-2 border-b border-black/25 focus:border-primary focus:shadow-[0_4px_10px_-6px_rgba(127,17,224,1)] shadow-primary transition-transform-colors duration-300 bg-transparent outline-none" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
                    </label>


                    <label className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-black/25">
                            <RiLockPasswordFill />
                        </span>
                        
                        <input type={showPassword ? 'text' : 'password'} className="text-text pl-9 w-full p-2 border-b border-black/25 focus:border-primary focus:shadow-[0_4px_10px_-6px_rgba(127,17,224,1)] shadow-primary transition-transform-colors duration-300 bg-transparent outline-none" placeholder="Password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />

                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/25 cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </label>

                    <label className="flex items-center gap-2 self-end">
                        <input type="checkbox" className="cursor-pointer" checked={rememberMe} onChange={() => setREmemberMe(!rememberMe)} />
                        <small className="text-gray-600">Remember Me</small>
                    </label>

                    <button type="submit" disabled={loading} className="disabled:bg-black/60 disabled:cursor-not-allowed relative text-sm cursor-pointer mt-4 w-1/2 self-center bg-black hover:bg-black/90 text-white py-2 px-4 rounded-md transition-colors duration-300 ease-out">
                        {loading && (
                            <span className="absolute inset-y-0 left-3 flex items-center pl-3">
                            {/* @ts-ignore */}
                            <CgSpinner size={18} className="animate-spin" />
                        </span>
                        )}
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}