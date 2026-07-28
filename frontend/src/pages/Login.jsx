import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Lock, Mail, ShieldAlert } from 'lucide-react';
import { z } from 'zod';
import AuthLayout from '../layouts/AuthLayout';
import { clearAuthError, loginAsync } from '../redux/slices/authSlice';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginAsync(data));
    if (loginAsync.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 text-white mb-3 shadow-lg shadow-indigo-500/30">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Welcome Back</h1>
        <p className="text-xs text-slate-400 mt-1">Sign in to access your company workspaces</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-medium text-xs rounded-lg shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-400 font-medium hover:underline">
          Register Company Owner
        </Link>
      </div>
    </AuthLayout>
  );
}
