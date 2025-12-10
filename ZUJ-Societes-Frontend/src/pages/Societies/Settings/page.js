import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SocietyHeader from '../Components/SocietyHeader';
import AxiosClient from '../../../config/axios';
import { toast } from "react-toastify";
import General from './Components/General';
import Privacy from './Components/Privacy';
import Permissions from './Components/Permissions';
import Notifications from './Components/Notifications';
import DangerZone from './Components/DangerZone';
import { useAutoSave } from '../../../hooks/useAutoSave';

export default function SocietySettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      name: '',
      description: '',
      image: '',
      category: ''
    },
    privacy: {
      visibility: 'public',
      joinApproval: true,
      memberListVisible: true,
      eventsVisible: true
    },
    permissions: {
      whoCanPost: 'all-members',
      whoCanCreateEvents: 'moderators',
      whoCanInvite: 'all-members'
    },
    notifications: {
      newMemberNotifications: true,
      emailNotifications: true
    }
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const handleSaveChanges = async () => {
    try {
      const response = await AxiosClient.put("/societies", {
        society_id: id,
        name: settings.general.name,
        description: settings.general.description,
        category: settings.general.category,
        privacy: settings.privacy,
        permissions: settings.permissions,
        notifications: settings.notifications
      });

      if (response.status === 204) {
        toast.success(`Society information has been updated`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleDeleteSociety = async () => {
    try {
      setIsDeleting(true);
      const response = await AxiosClient.delete('/societies', {
        params: {
          society_id: id,
        },
      });

      if (response.status === 200) {
        toast.success('Society deleted successfully');
        navigate('/societies');
      }
    } catch (error) {
      console.error('Error deleting society:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getSocietyDetails = async () => {
    try {
      const response = await AxiosClient.get('/societies/info', {
        params: { society_id: id },
      });

      if (response.status === 200) {
        const data = response.data.data;

        const newSettings = {
          general: {
            name: data.Name,
            description: data.Description,
            image: data.Image,
            category: data.Category
          },
          privacy: data.Privacy || {
            visibility: 'public',
            joinApproval: true,
            memberListVisible: true,
            eventsVisible: true
          },
          permissions: data.Permissions || {
            whoCanPost: 'all-members',
            whoCanCreateEvents: 'moderators',
            whoCanInvite: 'all-members'
          },
          notifications: data.Notifications || {
            newMemberNotifications: true,
            emailNotifications: true
          }
        };
        
        setSettings(newSettings);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching society details:', error);
    }
  };

  const handleGeneralChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const handlePermissionChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  
  const saveSwitchSettings = async () => {
    try {
      const response = await AxiosClient.put('/societies', {
        society_id: id,
        privacy: settings.privacy,
        permissions: settings.permissions,
        notifications: settings.notifications
      });

      if (response.status !== 204) {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  };

  const { isSaving, lastSaved } = useAutoSave(
    saveSwitchSettings, 
    dataLoaded ? { 
      privacy: settings.privacy, 
      permissions: settings.permissions, 
      notifications: settings.notifications 
    } : null, 
    1500
  );

  const leaveSociety = async () => {
    try {
      const response = await AxiosClient.put("/societies/leave", {
        society_id: id
      });

      if (response.status === 204) {
        toast.success(`You left the society`);
        navigate("/societies");
      }
    } catch (error) {
      console.error('Error leaving society:', error);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'permissions', label: 'Permissions', icon: '👥' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'danger', label: 'Danger Zone', icon: '⚠️' }
  ];

  useEffect(() => {
    getSocietyDetails();
    const idAnim = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(idAnim);
  }, []);

  return (
    <>
      <SocietyHeader societyId={id || '1'} />
      <main className={`min-h-screen py-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Settings
                </h2>
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <span className="mr-3 text-base">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                {activeTab === 'general' && <General settings={settings} handleGeneralChange={handleGeneralChange} />}
                {activeTab === 'privacy' && <Privacy settings={settings} handlePrivacyChange={handlePrivacyChange} />}
                {activeTab === 'permissions' && <Permissions settings={settings} handlePermissionChange={handlePermissionChange} />}
                {activeTab === 'notifications' && <Notifications settings={settings} handleNotificationChange={handleNotificationChange} />}
                {activeTab === 'danger' && <DangerZone leaveSociety={leaveSociety} setShowDeleteConfirm={setShowDeleteConfirm} />}

                {activeTab === 'general' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium">Cancel</button>
                      <button onClick={handleSaveChanges} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">Save Changes</button>
                    </div>
                  </div>
                )}

                {(activeTab === 'privacy' || activeTab === 'permissions' || activeTab === 'notifications') && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          Saving settings...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Settings are saved automatically
                          {lastSaved && (
                            <span className="ml-1 text-xs">
                              (last saved: {lastSaved.toLocaleTimeString()})
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-red-600">Confirm Deletion</h3>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  Are you sure you want to delete this society? This action cannot be undone and will permanently remove all data, members, and events.
                </p>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)} 
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteSociety}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Forever'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
