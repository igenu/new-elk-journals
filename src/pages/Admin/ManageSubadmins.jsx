import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiCopy, FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import api from '../../services/api';
import Swal from 'sweetalert2';

const ManageSubadmins = () => {
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedSubadmin, setSelectedSubadmin] = useState(null);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState({ email: false, password: false });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    permissions: []
  });

  useEffect(() => {
    fetchSubadmins();
    fetchPermissions();
  }, []);

  const fetchSubadmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subadmin/list');
      if (response.data.success) {
        setSubadmins(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subadmins:', error);
      Swal.fire('Error', 'Failed to fetch subadmins', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/subadmin/permissions/all');
      if (response.data.success) {
        setAvailablePermissions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const generatePassword = async () => {
    try {
      const response = await api.get('/subadmin/util/generate-password');
      if (response.data.success) {
        setFormData({ ...formData, password: response.data.password });
      }
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }

    try {
      const response = await api.post('/subadmin/create', formData);
      if (response.data.success) {
        setGeneratedCredentials(response.data.credentials);
        setShowModal(false);
        setShowPasswordModal(true);
        fetchSubadmins();
        resetForm();
        Swal.fire('Success', 'Subadmin created successfully', 'success');
      }
    } catch (error) {
      console.error('Error creating subadmin:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to create subadmin', 'error');
    }
  };

  const handleToggleStatus = async (subadminId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to change the status of this subadmin?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      });

      if (result.isConfirmed) {
        const response = await api.patch(`/subadmin/${subadminId}/toggle-status`);
        if (response.data.success) {
          fetchSubadmins();
          Swal.fire('Success', response.data.message, 'success');
        }
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (subadminId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await api.delete(`/subadmin/${subadminId}`);
        if (response.data.success) {
          fetchSubadmins();
          Swal.fire('Deleted!', 'Subadmin has been deleted.', 'success');
        }
      }
    } catch (error) {
      console.error('Error deleting subadmin:', error);
      Swal.fire('Error', 'Failed to delete subadmin', 'error');
    }
  };

  const handleResetPassword = async (subadminId) => {
    try {
      const response = await api.post(`/subadmin/${subadminId}/reset-password`);
      if (response.data.success) {
        setGeneratedCredentials(response.data.credentials);
        setShowPasswordModal(true);
        Swal.fire('Success', 'Password reset successfully', 'success');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Swal.fire('Error', 'Failed to reset password', 'error');
    }
  };

  const handleEditPermissions = (subadmin) => {
    setSelectedSubadmin(subadmin);
    setFormData({
      ...formData,
      permissions: subadmin.permissions || []
    });
    setShowPermissionModal(true);
  };

  const handleUpdatePermissions = async () => {
    try {
      const response = await api.put(`/subadmin/${selectedSubadmin.id}/permissions`, {
        permissions: formData.permissions
      });
      if (response.data.success) {
        setShowPermissionModal(false);
        setSelectedSubadmin(null);
        fetchSubadmins();
        Swal.fire('Success', 'Permissions updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      Swal.fire('Error', 'Failed to update permissions', 'error');
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [field]: true });
    setTimeout(() => setCopied({ ...copied, [field]: false }), 2000);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      permissions: []
    });
    setShowPassword(false);
  };

  const togglePermission = (permissionId) => {
    const currentPermissions = formData.permissions || [];
    if (currentPermissions.includes(permissionId)) {
      setFormData({
        ...formData,
        permissions: currentPermissions.filter(id => id !== permissionId)
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...currentPermissions, permissionId]
      });
    }
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const allPermissionIds = availablePermissions.map(perm => perm.id);
    setFormData({ ...formData, permissions: allPermissionIds });
  };

  // Deselect all permissions
  const deselectAllPermissions = () => {
    setFormData({ ...formData, permissions: [] });
  };

  // Toggle all permissions for a specific resource
  const toggleResourcePermissions = (perms) => {
    const currentPermissions = formData.permissions || [];
    const resourcePermIds = perms.map(p => p.id);
    const allSelected = resourcePermIds.every(id => currentPermissions.includes(id));

    if (allSelected) {
      // Deselect all for this resource
      setFormData({
        ...formData,
        permissions: currentPermissions.filter(id => !resourcePermIds.includes(id))
      });
    } else {
      // Select all for this resource
      const newPermissions = [...new Set([...currentPermissions, ...resourcePermIds])];
      setFormData({ ...formData, permissions: newPermissions });
    }
  };

  // Check if all permissions for a resource are selected
  const isResourceFullySelected = (perms) => {
    const currentPermissions = formData.permissions || [];
    return perms.every(p => currentPermissions.includes(p.id));
  };

  // Check if some (but not all) permissions for a resource are selected
  const isResourcePartiallySelected = (perms) => {
    const currentPermissions = formData.permissions || [];
    const selectedCount = perms.filter(p => currentPermissions.includes(p.id)).length;
    return selectedCount > 0 && selectedCount < perms.length;
  };

  const groupedPermissions = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {});

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Subadmins</h1>
          <p className="text-gray-600 text-sm mt-1">Create and manage subadmin accounts with custom permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#12b48b] hover:bg-[#0e9470] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FiPlus /> Create Subadmin
        </button>
      </div>

      {/* Subadmins Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#12b48b]"></div>
          </div>
        ) : subadmins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-center">No subadmins found. Create one to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subadmins.map((subadmin) => (
                  <tr key={subadmin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {subadmin.firstName} {subadmin.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {subadmin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subadmin.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subadmin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {subadmin.permissions?.length || 0} permissions
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {new Date(subadmin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPermissions(subadmin)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Permissions"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(subadmin.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            subadmin.isActive
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={subadmin.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {subadmin.isActive ? <FiX size={16} /> : <FiCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleResetPassword(subadmin.id)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <FiRefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(subadmin.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Subadmin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create New Subadmin</h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#12b48b]"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#12b48b]"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#12b48b]"
                  placeholder="Enter email address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#12b48b]"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.password, 'password')}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    disabled={!formData.password}
                  >
                    <FiCopy size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  {Object.keys(groupedPermissions).length > 0 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAllPermissions}
                        className="text-xs px-3 py-1 bg-[#12b48b] hover:bg-[#0e9470] text-white rounded transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllPermissions}
                        className="text-xs px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                      >
                        Deselect All
                      </button>
                    </div>
                  )}
                </div>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {Object.keys(groupedPermissions).length === 0 ? (
                    <p className="text-gray-500 text-sm">No permissions available. Seed permissions first.</p>
                  ) : (
                    Object.entries(groupedPermissions).map(([resource, perms]) => (
                      <div key={resource} className="mb-4 last:mb-0">
                        <div className="flex items-center justify-between border-b pb-1 mb-2">
                          <h4 className="font-semibold text-gray-700 capitalize">
                            {resource.replace('-', ' ')}
                          </h4>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isResourceFullySelected(perms)}
                              ref={el => {
                                if (el) el.indeterminate = isResourcePartiallySelected(perms);
                              }}
                              onChange={() => toggleResourcePermissions(perms)}
                              className="w-4 h-4 text-[#12b48b] rounded focus:ring-[#12b48b]"
                            />
                            <span className="text-xs text-gray-500">Select All</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pl-2">
                          {perms.map((perm) => (
                            <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.permissions.includes(perm.id)}
                                onChange={() => togglePermission(perm.id)}
                                className="w-4 h-4 text-[#12b48b] rounded focus:ring-[#12b48b]"
                              />
                              <span className="text-sm text-gray-600 capitalize">{perm.action}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#12b48b] hover:bg-[#0e9470] text-white rounded-lg transition-colors"
                >
                  Create Subadmin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Display Modal */}
      {showPasswordModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheck className="text-green-600" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Credentials Generated</h2>
              <p className="text-sm text-gray-600 mt-1">
                Save these credentials. The password won't be shown again.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedCredentials.email}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.email, 'email')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      copied.email ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copied.email ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedCredentials.password}
                    className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(generatedCredentials.password, 'password')}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      copied.password ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {copied.password ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowPasswordModal(false);
                setGeneratedCredentials(null);
                setCopied({ email: false, password: false });
              }}
              className="w-full mt-4 px-4 py-2 bg-[#12b48b] hover:bg-[#0e9470] text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Permissions Modal */}
      {showPermissionModal && selectedSubadmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Edit Permissions</h2>
                <p className="text-sm text-gray-600">
                  {selectedSubadmin.firstName} {selectedSubadmin.lastName} ({selectedSubadmin.email})
                </p>
              </div>
              <button
                onClick={() => { setShowPermissionModal(false); setSelectedSubadmin(null); }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex justify-end gap-2 mb-3">
              <button
                type="button"
                onClick={selectAllPermissions}
                className="text-xs px-3 py-1 bg-[#12b48b] hover:bg-[#0e9470] text-white rounded transition-colors"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={deselectAllPermissions}
                className="text-xs px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
              >
                Deselect All
              </button>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto mb-6">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between border-b pb-1 mb-2">
                    <h4 className="font-semibold text-gray-700 capitalize">
                      {resource.replace('-', ' ')}
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isResourceFullySelected(perms)}
                        ref={el => {
                          if (el) el.indeterminate = isResourcePartiallySelected(perms);
                        }}
                        onChange={() => toggleResourcePermissions(perms)}
                        className="w-4 h-4 text-[#12b48b] rounded focus:ring-[#12b48b]"
                      />
                      <span className="text-xs text-gray-500">Select All</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-2">
                    {perms.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-4 h-4 text-[#12b48b] rounded focus:ring-[#12b48b]"
                        />
                        <span className="text-sm text-gray-600 capitalize">{perm.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowPermissionModal(false); setSelectedSubadmin(null); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePermissions}
                className="px-4 py-2 bg-[#12b48b] hover:bg-[#0e9470] text-white rounded-lg transition-colors"
              >
                Update Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubadmins;
