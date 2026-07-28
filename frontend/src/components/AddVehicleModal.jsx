import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Car, X } from 'lucide-react';
import { z } from 'zod';
import { createVehicleAsync } from '../redux/slices/vehicleSlice';

const vehicleSchema = z.object({
  plateNumber: z.string().min(2, 'Plate number is required'),
  make: z.string().min(2, 'Vehicle make is required'),
  model: z.string().min(1, 'Vehicle model is required'),
  year: z.coerce.number().min(1900).max(2100),
  color: z.string().optional(),
  assignedDriver: z.string().optional(),
  registrationExpiry: z.string().min(1, 'Registration expiry date is required'),
  insuranceExpiry: z.string().min(1, 'Insurance expiry date is required'),
  vehicleStatus: z.enum(['Active', 'Maintenance', 'Decommissioned'])
});

export default function AddVehicleModal({ isOpen, onClose, companyId }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      vehicleStatus: 'Active',
      assignedDriver: 'Unassigned',
      registrationExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      insuranceExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      companyId
    };

    const result = await dispatch(createVehicleAsync(payload));
    if (createVehicleAsync.fulfilled.match(result)) {
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
              <Car className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Add Vehicle Record</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Plate Number</label>
              <input
                type="text"
                placeholder="DXB-99812"
                {...register('plateNumber')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
              {errors.plateNumber && <p className="text-[11px] text-rose-400 mt-0.5">{errors.plateNumber.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Status</label>
              <select
                {...register('vehicleStatus')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Decommissioned">Decommissioned</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Make</label>
              <input
                type="text"
                placeholder="Toyota"
                {...register('make')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.make && <p className="text-[11px] text-rose-400 mt-0.5">{errors.make.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Model</label>
              <input
                type="text"
                placeholder="Camry"
                {...register('model')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              {errors.model && <p className="text-[11px] text-rose-400 mt-0.5">{errors.model.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
              <input
                type="number"
                placeholder="2023"
                {...register('year')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Driver</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register('assignedDriver')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Color</label>
              <input
                type="text"
                placeholder="White"
                {...register('color')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Expiry Dates */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Renewal Expiry Dates</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mulkiya / Reg Expiry</label>
                <input
                  type="date"
                  {...register('registrationExpiry')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.registrationExpiry && <p className="text-[11px] text-rose-400 mt-0.5">{errors.registrationExpiry.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Insurance Expiry</label>
                <input
                  type="date"
                  {...register('insuranceExpiry')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.insuranceExpiry && <p className="text-[11px] text-rose-400 mt-0.5">{errors.insuranceExpiry.message}</p>}
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
              {isSubmitting ? 'Saving...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
