import React, { useState } from 'react';

// NOTE: If using React Router, replace the <a> tag at the bottom
// with: import { Link } from 'react-router-dom';
// and use <Link to="/login">...</Link>

/*
  IMPORTANT: This component is now styled using CSS variables
  (e.g., var(--color-primary)) which you have defined in your
  global tailwind.css file.
*/

export default function RegistrationPage() {
  // State to manage which step of the registration we are on
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Password

  // State for all form data
  const [formData, setFormData] = useState({
    phoneNumber: '',
    email: '',
    password: '',
    passwordConfirm: '', // Added for password confirmation
  });

  // State for the OTP
  const [otp, setOtp] = useState('');

  // Handler for all form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // --- Step 1 Handler: Submit Phone and Email ---
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    console.log('Step 1: Submitting details:', { 
      phone: formData.phoneNumber, 
      email: formData.email 
    });

    // --- In a real app, you would call your API here ---
    // 1. Send formData.email and formData.phoneNumber to your backend.
    // 2. Your backend generates an OTP and sends it to formData.email.
    // 3. Your backend responds with success.

    // If the API call is successful, show the OTP input
    alert('Details received! Please check your email for an OTP.');
    setStep(2); // Move to Step 2
  };

  // --- Step 2 Handler: Submit OTP ---
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    console.log('Step 2: Verifying OTP:', otp);

    // --- In a real app, you would call your API here ---
    // 1. Send the OTP (and formData.email) to your backend for verification.
    // 2. Your backend verifies if the OTP is correct.
    
    // If OTP is correct:
    alert('OTP Verified! Please set your password.');
    setStep(3); // Move to Step 3

    // If OTP is incorrect:
    // alert('Invalid OTP. Please try again.');
  };

  // --- Step 3 Handler: Submit Password ---
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.passwordConfirm) {
      alert("Passwords don't match. Please try again.");
      return;
    }

    console.log('Step 3: Setting password and completing registration.');
    
    // --- In a real app, you would call your API here ---
    // 1. Send the full registration details to your backend:
    //    { email: formData.email, phone: formData.phoneNumber, password: formData.password }
    // 2. Your backend creates the user account.

    alert('Account created successfully! You can now log in.');
    // Redirect to login page
    window.location.href = '/login'; 
  };
  
  // Reusable "Sign In" link
  const signInLink = (
    <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
      Already have an account?{' '}
      {/* Replace this <a> tag with <Link to="/login"> if using React Router */}
      <a href="/login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)]">
        Sign in
      </a>
    </p>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] font-inter">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-[var(--color-surface)] p-10 shadow-lg">
        
        {/* --- STEP 1: COLLECT PHONE & EMAIL --- */}
        {step === 1 && (
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Create a new account
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleDetailsSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                {/* Phone Number Input */}
                <div>
                  <label htmlFor="phone-number" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="phone-number"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                
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
                    className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </form>
            {signInLink}
          </div>
        )}

        {/* --- STEP 2: VERIFY EMAIL OTP --- */}
        {step === 2 && (
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Verify your email
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
              We've sent a 6-digit code to {formData.email}.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <label htmlFor="otp" className="sr-only">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength="6"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-center text-lg text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Verify Account
                </button>
              </div>
            </form>
            <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
              Didn't get a code?{' '}
              <button
                type="button"
                onClick={() => alert('Resending OTP... (simulated)')}
                className="font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] focus:outline-none"
              >
                Resend
              </button>
            </p>
            {signInLink}
          </div>
        )}

        {/* --- STEP 3: SET PASSWORD --- */}
        {step === 3 && (
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Set your password
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
              Almost done! Create a secure password.
            </p>
            <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="relative block w-full appearance-none rounded-t-md border border-gray-300 px-3 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                    placeholder="Password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    minLength={6}
                  />
                </div>
                
                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="passwordConfirm" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="relative block w-full appearance-none rounded-b-md border border-gray-300 px-3 py-3 text-[var(--color-text)] placeholder-[var(--color-muted)] focus:z-10 focus:border-[var(--color-primary)] focus:outline-none focus:ring-[var(--color-primary)] sm:text-sm"
                    placeholder="Confirm Password"
                    value={formData.passwordConfirm}
                    onChange={handleInputChange}
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                >
                  Complete Registration
                </button>
              </div>
            </form>
            {signInLink}
          </div>
        )}

      </div>
    </div>
  );
}