import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Receipt, Trash2, X } from 'lucide-react';
import { z } from 'zod';
import { createInvoiceAsync } from '../redux/slices/invoiceSlice';

const invoiceSchema = z.object({
  invoiceType: z.enum(['Invoice', 'Estimate']),
  clientName: z.string().min(2, 'Client name is required'),
  clientEmail: z.string().email().optional().or(z.literal('')),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  currency: z.enum(['AED', 'USD', 'EUR', 'GBP', 'INR']),
  discountAmount: z.coerce.number().optional().default(0),
  notes: z.string().optional(),
  terms: z.string().optional(),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1, 'Description required'),
        quantity: z.coerce.number().min(1, 'Qty min 1'),
        unitPrice: z.coerce.number().min(0, 'Price min 0'),
        taxRate: z.coerce.number().min(0).default(5)
      })
    )
    .min(1, 'At least 1 line item is required')
});

export default function AddInvoiceModal({ isOpen, onClose, companyId }) {
  const dispatch = useDispatch();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: 'Invoice',
      currency: 'AED',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      discountAmount: 0,
      terms: 'Payment due within 14 days of issue.',
      lineItems: [{ description: 'Professional Services', quantity: 1, unitPrice: 1000, taxRate: 5 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lineItems'
  });

  const watchLineItems = watch('lineItems') || [];
  const watchDiscount = watch('discountAmount') || 0;
  const watchCurrency = watch('currency') || 'AED';

  // Live totals calculation
  const subtotal = watchLineItems.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.unitPrice || 0)), 0);
  const taxAmount = watchLineItems.reduce((acc, item) => {
    const amt = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    return acc + (amt * Number(item.taxRate || 0)) / 100;
  }, 0);
  const totalAmount = Math.max(0, subtotal + taxAmount - Number(watchDiscount));

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      companyId
    };

    const result = await dispatch(createInvoiceAsync(payload));
    if (createInvoiceAsync.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Create Commercial Document</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4 overflow-y-auto pr-1">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Document Type</label>
              <select
                {...register('invoiceType')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Invoice">Tax Invoice</option>
                <option value="Estimate">Proforma Estimate</option>
              </select>
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
              <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Client Details */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Billed Client Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Client Name / Company</label>
                <input
                  type="text"
                  placeholder="Global Trading FZE"
                  {...register('clientName')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                {errors.clientName && <p className="text-[11px] text-rose-400 mt-0.5">{errors.clientName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Client Email</label>
                <input
                  type="email"
                  placeholder="accounts@globalfze.com"
                  {...register('clientEmail')}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Line Items</h3>
              <button
                type="button"
                onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxRate: 5 })}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <div className="col-span-5">
                    <input
                      type="text"
                      placeholder="Item description"
                      {...register(`lineItems.${index}.description`)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      {...register(`lineItems.${index}.quantity`)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 text-center"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      {...register(`lineItems.${index}.unitPrice`)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 text-right font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Tax %"
                      {...register(`lineItems.${index}.taxRate`)}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 text-center"
                    />
                  </div>

                  <div className="col-span-1 text-right">
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Breakdown Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 max-w-xs ml-auto">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-200">{watchCurrency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax / VAT:</span>
              <span className="font-mono text-slate-200">{watchCurrency} {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 items-center pt-1 border-t border-slate-800/80">
              <span>Discount:</span>
              <input
                type="number"
                step="0.01"
                {...register('discountAmount')}
                className="w-24 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-right text-xs text-white font-mono"
              />
            </div>
            <div className="flex justify-between text-sm font-bold text-indigo-400 pt-2 border-t border-slate-800">
              <span>Total Amount:</span>
              <span>{watchCurrency} {totalAmount.toFixed(2)}</span>
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
              {isSubmitting ? 'Generating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
