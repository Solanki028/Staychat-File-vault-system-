import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Landmark, X } from 'lucide-react';
import { z } from 'zod';
import { createBankAccountAsync } from '../redux/slices/bankSlice';

const bankSchema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  accountTitle: z.string().min(2, 'Account title is required'),
  accountNumber: z.string().min(5, 'Account number is required'),
  iban: z.string().min(15, 'Valid IBAN is required'),
  swiftCode: z.string().min(8, 'SWIFT code is required'),
  branchName: z.string().optional(),
  currency: z.enum(['AED', 'USD', 'EUR', 'GBP', 'INR']),
  isPrimary: z.boolean().default(false)
});

export default function AddBankModal({ isOpen, onClose, companyId }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      currency: 'AED',
      isPrimary: false
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      companyId
    };

    const result = await dispatch(createBankAccountAsync(payload));
    if (createBankAccountAsync.fulfilled.match(result)) {
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
              <Landmark className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Add Bank Account</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="Emirates NBD"
                {...register('bankName')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.bankName && <p className="text-[11px] text-rose-400 mt-0.5">{errors.bankName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Title / Beneficiary</label>
              <input
                type="text"
                placeholder="Acme Technologies LLC"
                {...register('accountTitle')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.accountTitle && <p className="text-[11px] text-rose-400 mt-0.5">{errors.accountTitle.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Account Number</label>
              <input
                type="text"
                placeholder="10192837465"
                {...register('accountNumber')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              {errors.accountNumber && <p className="text-[11px] text-rose-400 mt-0.5">{errors.accountNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Currency</label>
              <select
                {...register('currency')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="AED">AED (Dirham)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">SWIFT / BIC Code</label>
              <input
                type="text"
                placeholder="EBNBDUAE"
                {...register('swiftCode')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
              {errors.swiftCode && <p className="text-[11px] text-rose-400 mt-0.5">{errors.swiftCode.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">IBAN Number</label>
            <input
              type="text"
              placeholder="AE070330000101928374651"
              {...register('iban')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 uppercase font-mono"
            />
            {errors.iban && <p className="text-[11px] text-rose-400 mt-0.5">{errors.iban.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Branch Name</label>
            <input
              type="text"
              placeholder="Business Bay Branch"
              {...register('branchName')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPrimary"
              {...register('isPrimary')}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="isPrimary" className="text-xs text-slate-300 cursor-pointer">
              Set as Primary Operating Account for this company
            </label>
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
              {isSubmitting ? 'Saving...' : 'Add Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
