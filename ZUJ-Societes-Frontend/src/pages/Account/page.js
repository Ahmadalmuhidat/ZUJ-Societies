import { useState, useEffect } from 'react';
import AxiosClient from '../../config/axios';
import ProfileHeader from "./Components/ProfileHeader";
import Tabs from "./Components/Tabs";

export default function Account() {
  const [profileData, setProfileData] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const getUserProfileInfo = async () => {
    try {
      const response = await AxiosClient.get("/users/get_user_profile_info", {
        params: {
          token: localStorage.getItem("token") || sessionStorage.getItem("token")
        }
      });

      if (response.status === 200) {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfileInfo();
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-white rounded-lg shadow-sm"></div>
            <div className="h-64 bg-white rounded-lg shadow-sm"></div>
          </div>
        ) : (
          <>
            <ProfileHeader profileData={profileData} />
            <Tabs
              profileData={profileData}
              setProfileData={setProfileData}
              getUserProfileInfo={getUserProfileInfo}
            />
          </>
        )}
      </div>
    </main>
  );
}
