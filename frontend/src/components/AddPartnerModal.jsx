import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Handshake, X, AlertCircle } from 'lucide-react';
import { z } from 'zod';
import { createPartnerAsync } from '../redux/slices/partnerSlice';

const partnerSchema = z.object({
  partnerName: z.string().min(2, 'Partner name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  ownershipPercentage: z.coerce
    .number()
    .min(0.01, 'Percentage must be at least 0.01%')
    .max(100.0, 'Percentage cannot exceed 100.00%'),
  role: z.enum(['Managing Partner', 'Silent Partner', 'Shareholder'])
});

export default function AddPartnerModal({ isOpen, onClose, companyId, availablePercentage }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      role: 'Shareholder',
      ownershipPercentage: Math.min(25, availablePercentage || 100)
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    if (data.ownershipPercentage > availablePercentage) {
      setError('ownershipPercentage', {
        type: 'manual',
        message: `Allocation exceeds max available limit of ${availablePercentage.toFixed(2)}%`
      });
      return;
    }

    const payload = {
      ...data,
      companyId
    };

    const result = await dispatch(createPartnerAsync(payload));
    if (createPartnerAsync.fulfilled.match(result)) {
      reset();
      onClose();
    } else {
      setError('root', {
        type: 'manual',
        message: result.payload || 'Failed to add partner.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Handshake className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Add Company Partner</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {errors.root && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Partner Full Name</label>
              <input
                type="text"
                placeholder="Marcus Vance"
                {...register('partnerName')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.partnerName && <p className="text-[11px] text-rose-400 mt-0.5">{errors.partnerName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="marcus@partner.com"
                {...register('email')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.email && <p className="text-[11px] text-rose-400 mt-0.5">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
              <input
                type="text"
                placeholder="+971 50 111 2233"
                {...register('phone')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.phone && <p className="text-[11px] text-rose-400 mt-0.5">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ownership % (Max: {availablePercentage.toFixed(2)}%)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="25.00"
                {...register('ownershipPercentage')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.ownershipPercentage && <p className="text-[11px] text-rose-400 mt-0.5">{errors.ownershipPercentage.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Partner Role</label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Managing Partner">Managing Partner</option>
                <option value="Silent Partner">Silent Partner</option>
                <option value="Shareholder">Shareholder</option>
              </select>
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
              {isSubmitting ? 'Adding...' : 'Add Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
