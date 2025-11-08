import React, { useState } from 'react';

// NOTE: If using React Router, replace the <a> tags at the bottom
// with: import { Link } from 'react-router-dom';
// and use <Link to="/register">...</Link> and <Link to="#">...</Link>

/*
  IMPORTANT: This component is now styled using CSS variables
  (e.g., var(--color-primary)) which you have defined in your
  global tailwind.css file.
*/

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your login logic here
    console.log('Login attempt with:', { email, password });
    // --- In a real app, you would call your API here ---
    // 1. Send {email, password} to your backend.
    // 2. If successful, save the auth token/session.
    // 3. Redirect to the user's dashboard.
    
    alert('Login successful! (Simulated)');
    // Optionally redirect to dashboard:
    // window.location.href = '/dashboard'; 
  };

  return (
    // Full-screen container to center the form
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] font-inter">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[var(--color-surface)] p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password (Optional) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--color-muted)]">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              {/* Replace <a> with <Link to="/forgot-password"> if using React Router */}
              <a href="#" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)]">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Link to Registration Page */}
        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          Don't have an account?{' '}
          {/* Replace this <a> tag with <Link to="/register"> if using React Router */}
          <a href="/register" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)]">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}