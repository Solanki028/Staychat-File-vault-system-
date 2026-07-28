import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, X } from 'lucide-react';
import { z } from 'zod';
import { createCompanyAsync } from '../redux/slices/companySlice';

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  registrationNumber: z.string().min(2, 'Registration number is required'),
  companyType: z.enum(['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Freezone']),
  industry: z.string().min(2, 'Industry is required'),
  contact: z.object({
    email: z.string().email('Invalid contact email'),
    phone: z.string().min(5, 'Valid phone number required'),
    website: z.string().optional()
  }),
  address: z.object({
    street: z.string().min(2, 'Street is required'),
    city: z.string().min(2, 'City is required'),
    country: z.string().min(2, 'Country is required')
  })
});

export default function AddCompanyModal({ isOpen, onClose }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyType: 'LLC',
      industry: 'Technology & Services'
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const result = await dispatch(createCompanyAsync(data));
    if (createCompanyAsync.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Create New Company</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                placeholder="Acme Technologies"
                {...register('companyName')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.companyName && <p className="text-[11px] text-rose-400 mt-0.5">{errors.companyName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Registration Number</label>
              <input
                type="text"
                placeholder="REG-991823"
                {...register('registrationNumber')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.registrationNumber && <p className="text-[11px] text-rose-400 mt-0.5">{errors.registrationNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Type</label>
              <select
                {...register('companyType')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="LLC">LLC</option>
                <option value="Corporation">Corporation</option>
                <option value="Partnership">Partnership</option>
                <option value="Freezone">Freezone</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                placeholder="Software & IT"
                {...register('industry')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Contact Subdocument */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Contact Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Email</label>
                <input
                  type="email"
                  placeholder="contact@acme.com"
                  {...register('contact.email')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.contact?.email && <p className="text-[11px] text-rose-400 mt-0.5">{errors.contact.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+971 50 123 4567"
                  {...register('contact.phone')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.contact?.phone && <p className="text-[11px] text-rose-400 mt-0.5">{errors.contact.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Address Subdocument */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Address</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Street</label>
                <input
                  type="text"
                  placeholder="Sheikh Zayed Rd"
                  {...register('address.street')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Dubai"
                  {...register('address.city')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  placeholder="UAE"
                  {...register('address.country')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Company Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
