import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  AlertTriangle, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  BadgeAlert
} from 'lucide-react';
import AddEmployeeModal from '../../components/AddEmployeeModal';
import Loader from '../../components/Loader';
import WorkspaceLayout from '../../layouts/WorkspaceLayout';
import { 
  deleteEmployeeAsync, 
  fetchEmployeesAsync, 
  fetchExpiringAsync 
} from '../../redux/slices/employeeSlice';

const DEPARTMENTS = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];

export default function WorkspaceEmployees() {
  const { companyId } = useParams();
  const dispatch = useDispatch();

  const { list: employees, expiringList, loading, pagination } = useSelector((state) => state.employees);
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(null);

  useEffect(() => {
    if (companyId) {
      dispatch(
        fetchEmployeesAsync({
          companyId,
          params: {
            department: activeDepartment !== 'All' ? activeDepartment : undefined,
            search: searchQuery
          }
        })
      );
      dispatch(fetchExpiringAsync(companyId));
    }
  }, [dispatch, companyId, activeDepartment, searchQuery]);

  const handleDeleteEmployee = async () => {
    if (!empToDelete) return;
    await dispatch(deleteEmployeeAsync(empToDelete._id));
    setEmpToDelete(null);
  };

  return (
    <WorkspaceLayout companyName="Company Workspace">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Employee Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage company workforce records, designations, and passport/visa renewal deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Document Expiration Warning Banner */}
      {expiringList.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 flex items-start gap-3">
          <BadgeAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-semibold text-amber-300">
              Document Renewal Alert ({expiringList.length} Employee{expiringList.length > 1 ? 's' : ''})
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              The following employees have passports or visas expiring within the next 30 days:{' '}
              <span className="font-semibold text-white">
                {expiringList.map((e) => e.fullName).join(', ')}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeDepartment === dept
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Employee Directory Table */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Loader />
        </div>
      ) : employees.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Employee</th>
                <th className="py-3.5 px-4 font-semibold">Designation</th>
                <th className="py-3.5 px-4 font-semibold">Department</th>
                <th className="py-3.5 px-4 font-semibold">Contact</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                        {emp.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{emp.fullName}</p>
                        <p className="text-[10px] text-slate-500">Joined: {new Date(emp.joiningDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-200">{emp.designation}</td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50 text-[10px]">
                      {emp.department}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        emp.employmentStatus === 'Active'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : emp.employmentStatus === 'On Leave'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}
                    >
                      {emp.employmentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setEmpToDelete(emp)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Employees Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Add employee profiles to manage company staff, departments, and visa expiry tracking.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        companyId={companyId}
      />

      {/* Delete Confirmation Modal */}
      {empToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white text-center">Delete Employee Record?</h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Are you sure you want to delete <span className="text-white font-semibold">{empToDelete.fullName}</span>?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEmpToDelete(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceLayout>
  );
}
