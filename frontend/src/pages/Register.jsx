import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Lock, Mail, ShieldAlert, User } from 'lucide-react';
import { z } from 'zod';
import AuthLayout from '../layouts/AuthLayout';
import { clearAuthError, registerAsync } from '../redux/slices/authSlice';

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password minimum 8 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Must contain uppercase, lowercase, number & special character'),
    confirmPassword: z.string().min(1, 'Confirm password is required')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(registerAsync({ fullName: data.fullName, email: data.email, password: data.password }));
    if (registerAsync.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white mb-3 shadow-lg shadow-indigo-500/30">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Create Business Owner Account</h1>
        <p className="text-xs text-slate-400 mt-1">Register to manage companies and workspaces</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Priyanshu Solanki"
              {...register('fullName')}
              className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border ${
                errors.fullName ? 'border-rose-500/50' : 'border-slate-700/60'
              } rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
          </div>
          {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="owner@company.com"
              {...register('email')}
              className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border ${
                errors.email ? 'border-rose-500/50' : 'border-slate-700/60'
              } rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border ${
                errors.password ? 'border-rose-500/50' : 'border-slate-700/60'
              } rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
          </div>
          {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border ${
                errors.confirmPassword ? 'border-rose-500/50' : 'border-slate-700/60'
              } rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
            />
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-rose-400 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium text-xs rounded-lg shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="text-indigo-400 font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
