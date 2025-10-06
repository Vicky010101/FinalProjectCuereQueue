import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, Palette, Save, X } from "lucide-react";
import { toast } from "sonner";
import API from "../api";

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisibility: 'public',
      showPhone: false,
      showAddress: false
    },
    preferences: {
      theme: 'light',
      language: 'en'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In a real app, you'd fetch settings from the backend
      // For now, we'll use default settings
      setLoading(false);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Failed to load settings");
      setLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you'd save settings to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container-responsive" style={{ paddingTop: 24 }}>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="container-responsive" style={{ paddingTop: 24, paddingBottom: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and privacy settings.</p>
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        {/* Notifications */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Notifications</h2>
            <Bell size={20} color="#0f766e" />
          </div>
          
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Email Notifications</p>
                <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>Receive updates via email</p>
              </div>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                />
              </label>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>SMS Notifications</p>
                <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>Receive updates via SMS</p>
              </div>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.sms}
                  onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                />
              </label>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Push Notifications</p>
                <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>Receive in-app notifications</p>
              </div>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={settings.notifications.push}
                  onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Privacy</h2>
            <Shield size={20} color="#0f766e" />
          </div>
          
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label className="label">Profile Visibility</label>
              <select
                className="input"
                value={settings.privacy.profileVisibility}
                onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
              </select>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Show Phone Number</p>
                <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>Allow others to see your phone</p>
              </div>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={settings.privacy.showPhone}
                  onChange={(e) => handleSettingChange('privacy', 'showPhone', e.target.checked)}
                />
              </label>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Show Address</p>
                <p className="text-muted" style={{ fontSize: 14, margin: 0 }}>Allow others to see your address</p>
              </div>
              <label style={{ display: "inline-flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={settings.privacy.showAddress}
                  onChange={(e) => handleSettingChange('privacy', 'showAddress', e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Preferences</h2>
            <Palette size={20} color="#0f766e" />
          </div>
          
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label className="label">Theme</label>
              <select
                className="input"
                value={settings.preferences.theme}
                onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div>
              <label className="label">Language</label>
              <select
                className="input"
                value={settings.preferences.language}
                onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Actions</h2>
            <SettingsIcon size={20} color="#0f766e" />
          </div>
          
          <div style={{ display: "grid", gap: 12 }}>
            <button className="btn" style={{ justifyContent: "flex-start" }}>
              Change Password
            </button>
            <button className="btn" style={{ justifyContent: "flex-start" }}>
              Export Data
            </button>
            <button className="btn btn-red" style={{ justifyContent: "flex-start" }}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Settings;



