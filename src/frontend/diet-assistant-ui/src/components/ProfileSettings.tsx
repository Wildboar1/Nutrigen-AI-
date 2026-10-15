import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Smartphone,
  Lock,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Key,
  Fingerprint,
  Globe,
  Moon,
  Sun,
  Languages,
  Ruler,
  Clock
} from 'lucide-react';

interface ProfileSettingsProps {
  userType: 'individual' | 'professional';
}

export function ProfileSettings({ userType }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('account');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const [settings, setSettings] = useState({
    // Account Settings
    twoFactorEnabled: false,
    biometricEnabled: true,
    sessionTimeout: '24h',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    mealReminders: true,
    dataInsights: true,
    weeklyReports: true,
    marketingEmails: false,
    
    // Privacy Settings
    profileVisibility: 'private',
    dataSharing: false,
    analyticsSharing: true,
    researchParticipation: true,
    
    // App Settings
    theme: 'light',
    language: 'en',
    units: 'imperial',
    timezone: 'America/Los_Angeles',
    autoSync: true,
    offlineMode: false
  });
    const { user } = require('../contexts/UserContext');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setHasChanges(false);
    setLastSaved(new Date());
  };

    // Sync settings with user context when user changes (e.g., after signup)
    React.useEffect(() => {
      setSettings((prev) => ({
        ...prev,
        age: user?.userData?.age || '',
        gender: user?.userData?.gender || '',
        weight: user?.userData?.weight || '',
        height: user?.userData?.height || '',
        activityLevel: user?.userData?.activity_level || '',
        dietaryRestrictions: user?.userData?.dietary_restrictions || [],
      }));
    }, [user]);
  const handleReset = () => {
    // Reset to default values
    setHasChanges(false);
  };

  const enable2FA = async () => {
    // Simulate 2FA setup
    await new Promise(resolve => setTimeout(resolve, 1000));
    handleSettingChange('twoFactorEnabled', true);
  };

  const exportData = async () => {
    // Simulate data export
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Trigger download
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Save Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasChanges && (
            <Alert className="inline-flex items-center py-2 px-3">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription className="text-sm">
                You have unsaved changes
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Last Saved Indicator */}
      <div className="text-sm text-gray-500 flex items-center">
        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
        Last saved: {lastSaved.toLocaleString()}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Advanced</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Security Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${settings.twoFactorEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Key className={`h-5 w-5 ${settings.twoFactorEnabled ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">
                        {settings.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security to your account'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {settings.twoFactorEnabled && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    <Button 
                      variant="outline"
                      onClick={enable2FA}
                      disabled={settings.twoFactorEnabled}
                    >
                      {settings.twoFactorEnabled ? 'Configure' : 'Enable 2FA'}
                    </Button>
                  </div>
                </div>

                {/* Biometric Authentication */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Fingerprint className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Biometric Authentication</h3>
                      <p className="text-sm text-gray-500">Use fingerprint or face recognition</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.biometricEnabled}
                    onCheckedChange={(checked: boolean) => handleSettingChange('biometricEnabled', checked)}
                  />
                </div>

                {/* Session Timeout */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Clock className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Session Timeout</h3>
                      <p className="text-sm text-gray-500">Automatically sign out after inactivity</p>
                    </div>
                  </div>
                  <Select value={settings.sessionTimeout} onValueChange={(value: string) => handleSettingChange('sessionTimeout', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Communication Channels */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Communication Channels</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <Label>Push Notifications</Label>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked: boolean) => handleSettingChange('pushNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <Label>Email Notifications</Label>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked: boolean) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-4 w-4 text-gray-400" />
                        <Label>SMS Notifications</Label>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked: boolean) => handleSettingChange('smsNotifications', checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Content Preferences */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Content Preferences</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Meal Reminders</Label>
                      <Switch
                        checked={settings.mealReminders}
                        onCheckedChange={(checked: boolean) => handleSettingChange('mealReminders', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Health Insights</Label>
                      <Switch
                        checked={settings.dataInsights}
                        onCheckedChange={(checked: boolean) => handleSettingChange('dataInsights', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Weekly Reports</Label>
                      <Switch
                        checked={settings.weeklyReports}
                        onCheckedChange={(checked: boolean) => handleSettingChange('weeklyReports', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Marketing & Tips</Label>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(checked: boolean) => handleSettingChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Privacy & Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-gray-500">Who can see your profile information</p>
                    </div>
                    <Select value={settings.profileVisibility} onValueChange={(value: string) => handleSettingChange('profileVisibility', value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-gray-500">Share anonymized data with research partners</p>
                    </div>
                    <Switch
                      checked={settings.dataSharing}
                      onCheckedChange={(checked: boolean) => handleSettingChange('dataSharing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Sharing</Label>
                      <p className="text-sm text-gray-500">Help improve the platform with usage analytics</p>
                    </div>
                    <Switch
                      checked={settings.analyticsSharing}
                      onCheckedChange={(checked: boolean) => handleSettingChange('analyticsSharing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Research Participation</Label>
                      <p className="text-sm text-gray-500">Participate in nutrition research studies</p>
                    </div>
                    <Switch
                      checked={settings.researchParticipation}
                      onCheckedChange={(checked: boolean) => handleSettingChange('researchParticipation', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Export & Deletion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium">Export Your Data</h3>
                    <p className="text-sm text-gray-500">Download all your personal data and insights</p>
                  </div>
                  <Button variant="outline" onClick={exportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-medium text-red-900">Delete Account</h3>
                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>App Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={settings.theme} onValueChange={(value: string) => handleSettingChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="auto">
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={settings.language} onValueChange={(value: string) => handleSettingChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français</SelectItem>
                        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                        <SelectItem value="zh">🇨🇳 中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Units</Label>
                    <Select value={settings.units} onValueChange={(value: string) => handleSettingChange('units', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial (lb, ft, °F)</SelectItem>
                        <SelectItem value="metric">Metric (kg, m, °C)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value: string) => handleSettingChange('timezone', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Sync Data</Label>
                      <p className="text-sm text-gray-500">Automatically sync data from connected devices</p>
                    </div>
                    <Switch
                      checked={settings.autoSync}
                      onCheckedChange={(checked: boolean) => handleSettingChange('autoSync', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Offline Mode</Label>
                      <p className="text-sm text-gray-500">Continue using the app without internet</p>
                    </div>
                    <Switch
                      checked={settings.offlineMode}
                      onCheckedChange={(checked: boolean) => handleSettingChange('offlineMode', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


