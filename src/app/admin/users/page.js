// src/app/admin/users/page.js (FINAL, HONEST, and CORRECT Version)

"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Edit, Trash2, Inbox, ShieldAlert, Loader2 } from 'lucide-react';
import { useGetUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from '../../../store/api/apiSlice';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import TableSkeleton from '../../../components/common/TableSkeleton';

function EditUserModal({ user, isOpen, onClose }) {
    // ... (This component's code is unchanged)
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

    const handleSave = async () => {
        const toastId = toast.loading("Updating user role...");
        try {
            await updateUserRole({ id: user._id, role: selectedRole }).unwrap();
            toast.success("User role updated successfully!", { id: toastId });
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update role.", { id: toastId });
        }
    };

    return (
        <ConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={handleSave} title={`Edit User: ${user.name}`} confirmText="Save Changes" isDestructive={false} isLoading={isLoading}>
            <div className="mt-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">User Role</label>
                <select id="role" name="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" disabled={user.role === 'superadmin'}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                {user.role === 'superadmin' && <p className="text-xs text-yellow-500 mt-2">The role of a Superadmin cannot be changed.</p>}
            </div>
        </ConfirmationModal>
    );
}

function AccessDenied() {
    // ... (This component's code is unchanged)
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
            <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">This area is restricted to Superadmins only.</p>
            <Link href="/admin/dashboard" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition">
                Return to Dashboard
            </Link>
        </div>
    );
}

export default function AdminUsersPage() {
    const { data: session, status } = useSession({ required: true });
    
    const { data: users, isLoading, error } = useGetUsersQuery(undefined, {
        skip: !session || session.user.role !== 'superadmin',
    });
    
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState(null);

    const handleDelete = async () => {
        // ... (This function is unchanged)
        if (!selectedUserForDelete) return;
        const toastId = toast.loading("Deleting user...");
        try {
            await deleteUser(selectedUserForDelete._id).unwrap();
            toast.success("User deleted successfully!", { id: toastId });
            setSelectedUserForDelete(null);
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete user.", { id: toastId });
        }
    };
    
    if (status === 'loading' || isLoading) {
        return (
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>
                <TableSkeleton rowCount={5} colCount={5} />
            </div>
        );
    }
    
    if (session && session.user.role !== 'superadmin') { return <AccessDenied />; }
    if (error) { return <AccessDenied />; }

    return (
        <>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">User Management</h1>

                {users && users.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    {/* ★★★★★ বড় স্ক্রিনে Email এবং Joined On দেখা যাবে ★★★★★ */}
                                    <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider md:table-cell">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider lg:table-cell">Joined On</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        {/* ★★★★★ বড় স্ক্রিনে Email এবং Joined On দেখা যাবে ★★★★★ */}
                                        <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 md:table-cell">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${ user.role === 'superadmin' ? 'bg-red-100 text-red-800' : user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800' }`}>{user.role}</span>
                                        </td>
                                        <td className="hidden px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 lg:table-cell">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <div className="flex items-center justify-end gap-x-4">
                                                <button onClick={() => setSelectedUserForEdit(user)} className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed" disabled={session?.user?.id === user._id || user.role === 'superadmin'} title="Edit Role"><Edit className="h-5 w-5" /></button>
                                                <button onClick={() => setSelectedUserForDelete(user)} className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed" disabled={session?.user?.id === user._id || user.role === 'superadmin'} title="Delete User"><Trash2 className="h-5 w-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        {/* ... (No users found UI is unchanged) ... */}
                    </div>
                )}
            </div>
            {selectedUserForEdit && <EditUserModal user={selectedUserForEdit} isOpen={!!selectedUserForEdit} onClose={() => setSelectedUserForEdit(null)} />}
            {selectedUserForDelete && <ConfirmationModal isOpen={!!selectedUserForDelete} onClose={() => setSelectedUserForDelete(null)} onConfirm={handleDelete} title="Delete User" message={`Are you sure you want to delete ${selectedUserForDelete.name}? This action cannot be undone.`} confirmText="Delete User" isLoading={isDeleting} />}
        </>
    );
}