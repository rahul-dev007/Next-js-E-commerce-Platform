// src/app/admin/users/page.js (সম্পূর্ণ এবং ফিক্সড সংস্করণ)

"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, ShieldAlert, Users, Calendar, Mail } from 'lucide-react';
import Image from 'next/image';

// ★★★ সঠিক পাথ: ../../../../ ★★★
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../../../store/api/apiSlice';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
// Helper Component: UserAvatar
function UserAvatar({ user }) {
  // নামের অস্তিত্ব এবং টাইপ চেক করা হচ্ছে
  const userName = typeof user.name === 'string' ? user.name : 'Unknown';
  
  return (
    <div className="relative h-12 w-12 flex-shrink-0">
      <Image
        src={user.image || `https://ui-avatars.com/api/?name=${userName.replace(/\s/g, '+')}&background=1f2937&color=e5e7eb&bold=true`}
        alt={userName}
        width={48}
        height={48}
        className="rounded-full object-cover border-2 border-slate-600"
      />
      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-slate-800" title="Active"></span>
    </div>
  );
}

// Helper Component: RoleBadge
function RoleBadge({ role }) {
  const styles = {
    superadmin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    admin: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    user: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[role] || styles.user}`}>{role}</span>;
}

// Helper Component: InfoRow
function InfoRow({ icon, text }) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-300">
            {icon}
            <span>{text}</span>
        </div>
    );
}

// Component: UserCard
function UserCard({ user, session, onEdit, onDelete }) {
  return (
    <motion.div
      className="card-glass p-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      layout
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow">
          <UserAvatar user={user} />
          <div className="flex flex-col">
            <p className="text-lg font-bold text-white leading-tight">{user.name || 'No Name'}</p>
            <InfoRow icon={<Mail className="h-4 w-4" />} text={user.email || 'No Email'} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mt-4 md:mt-0 w-full md:w-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <RoleBadge role={user.role} />
            {user.createdAt && <InfoRow icon={<Calendar className="h-4 w-4" />} text={`Joined: ${new Date(user.createdAt).toLocaleDateString()}`} />}
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center ml-auto md:ml-0">
            <button onClick={onEdit} className="text-gray-400 hover:text-sky-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled={session?.user?.id === user._id || user.role === 'superadmin'} title="Edit Role">
              <Edit className="h-5 w-5" />
            </button>
            <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" disabled={session?.user?.id === user._id || user.role === 'superadmin'} title="Delete User">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// Main Page Component
export default function AdminUsersPage() {
    const { data: session, status } = useSession({ required: true });
    
    const { data: users, isLoading, error } = useGetUsersQuery(undefined, {
        skip: !session || session.user.role !== 'superadmin',
    });

    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

    const handleDelete = async () => {
        if (!selectedUserForDelete) return;
        const toastId = toast.loading("Deleting user...");
        try {
            await deleteUser(selectedUserForDelete._id).unwrap();
            toast.success("User deleted successfully!", { id: toastId });
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete user.", { id: toastId });
        } finally {
            setSelectedUserForDelete(null);
        }
    };

    const EditUserModal = ({ user, isOpen, onClose }) => {
        const [selectedRole, setSelectedRole] = useState(user.role);
        const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
        const handleSave = async () => {
            const toastId = toast.loading("Updating user role...");
            try {
                await updateUserRole({ id: user._id, role: selectedRole }).unwrap();
                toast.success("User role updated!", { id: toastId });
                onClose();
            } catch (err) { toast.error(err?.data?.message || "Failed to update role.", { id: toastId }); }
        };
        return (
            <ConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={handleSave} title={`Edit Role: ${user.name}`} confirmText="Save Changes" isDestructive={false} isLoading={isUpdating} className="modal-glass">
                <div className="mt-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Assign New Role</label>
                    <select id="role" name="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800/80 py-2 pl-3 pr-10 text-white focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" disabled={user.role === 'superadmin'}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {user.role === 'superadmin' && <p className="text-xs text-yellow-400 mt-2 flex items-center"><ShieldAlert className="h-4 w-4 mr-2" />A Superadmin's role cannot be altered.</p>}
                </div>
            </ConfirmationModal>
        );
    };

    const AccessDenied = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="card-glass p-8 text-center max-w-md mx-auto">
                <ShieldAlert className="mx-auto h-16 w-16 text-yellow-400" />
                <h1 className="mt-4 text-3xl font-bold text-white">Access Denied</h1>
                <p className="mt-2 text-gray-300">This sanctuary is for Superadmins only.</p>
                <Link href="/admin/dashboard" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-500 transition">Return to Dashboard</Link>
            </div>
        </motion.div>
    );
    
    const pageContent = () => {
        if (status === 'loading' || isLoading) {
            return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="card-glass p-5 h-[92px] animate-pulse" />)}</div>;
        }
        if (session && session.user.role !== 'superadmin') { return <AccessDenied />; }
        if (error) { return <AccessDenied />; }

        if (users && users.length > 0) {
            return (
                <div className="space-y-4">
                    <AnimatePresence>
                        {users.map((user) => (
                            <UserCard key={user._id} user={user} session={session} onEdit={() => setSelectedUserForEdit(user)} onDelete={() => setSelectedUserForDelete(user)} />
                        ))}
                    </AnimatePresence>
                </div>
            );
        }

        return (
            <div className="card-glass text-center py-20">
                <Users className="mx-auto h-16 w-16 text-gray-500" />
                <h3 className="mt-6 text-xl font-semibold text-white">No Users Found</h3>
                <p className="mt-2 text-base text-gray-400">The user roster is currently empty.</p>
            </div>
        );
    };

    return (
        <div className="aurora-background min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx--auto">
                <motion.div className="flex justify-between items-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl sm:text-4xl font-bold text-blue-950">User Management:</h1>
                    {users && <div className="card-glass px-4 py-2 text-sm font-semibold">{users.length} Active Users</div>}
                </motion.div>
                
                {pageContent()}
            </div>
            
            {selectedUserForEdit && <EditUserModal user={selectedUserForEdit} isOpen={!!selectedUserForEdit} onClose={() => setSelectedUserForEdit(null)} />}
            {selectedUserForDelete && <ConfirmationModal isOpen={!!selectedUserForDelete} onClose={() => setSelectedUserForDelete(null)} onConfirm={handleDelete} title="Delete User" message={`Are you sure you want to permanently delete ${selectedUserForDelete.name}? This action cannot be undone.`} confirmText="Confirm Deletion" isLoading={isDeleting} className="modal-glass" />}
        </div>
    );
}