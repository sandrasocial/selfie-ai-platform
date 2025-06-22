'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Shield, 
  Ban, 
  Mail,
  Calendar,
  Crown,
  User,
  Settings
} from 'lucide-react'
import AdminLayout from '@/app/components/admin/AdminLayout'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name?: string
  role: 'user' | 'admin' | 'super_admin'
  is_admin: boolean
  avatar_url?: string
  created_at: string
  updated_at: string
  metadata: any
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'super_admin') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          role: newRole, 
          is_admin: newRole === 'admin' || newRole === 'super_admin',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) throw error
      
      fetchUsers() // Refresh the list
      setShowEditModal(false)
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleBadge = (role: string) => {
    const colors = {
      super_admin: 'bg-yellow-100 text-yellow-800',
      admin: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${colors[role as keyof typeof colors]}`}>
        {role.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#171719] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[#B5B5B3]">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bodoni text-[#171719] mb-2">User Management</h1>
            <p className="text-[#B5B5B3]">Manage user accounts, roles, and permissions</p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className="text-sm text-[#B5B5B3]">
              {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B5B5B3] w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
            />
          </div>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
            <option value="super_admin">Super Admins</option>
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-white border border-[#B5B5B3]/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F1F1F1]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#171719] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#171719] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#171719] uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#171719] uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#171719] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B5B5B3]/20">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F1F1F1]/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#171719]/10 rounded-full flex items-center justify-center text-[#171719] font-medium mr-3">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#171719]">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-[#B5B5B3]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B5B5B3]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#B5B5B3]">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                        className="text-[#171719] hover:text-[#B5B5B3] transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[#B5B5B3] mx-auto mb-4" />
            <p className="text-[#B5B5B3]">No users found matching your search criteria</p>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bodoni text-[#171719] mb-4">Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#171719] mb-2">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    disabled
                    className="w-full p-3 border border-[#B5B5B3]/20 bg-[#F1F1F1] text-[#B5B5B3]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#171719] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={selectedUser.full_name || ''}
                    disabled
                    className="w-full p-3 border border-[#B5B5B3]/20 bg-[#F1F1F1] text-[#B5B5B3]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#171719] mb-2">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      role: e.target.value as 'user' | 'admin' | 'super_admin'
                    })}
                    className="w-full p-3 border border-[#B5B5B3]/20 focus:border-[#171719] outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => updateUserRole(selectedUser.user_id, selectedUser.role)}
                  className="flex-1 bg-[#171719] text-white py-2 px-4 hover:bg-[#171719]/90 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedUser(null)
                  }}
                  className="flex-1 border border-[#B5B5B3]/20 text-[#171719] py-2 px-4 hover:bg-[#F1F1F1] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
