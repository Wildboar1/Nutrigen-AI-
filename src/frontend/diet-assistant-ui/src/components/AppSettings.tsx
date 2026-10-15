import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Download,
  Upload,
  Trash2,
  ExternalLink,
  Info,
  ToggleLeft,
  ToggleRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function AppSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const notificationSettings = [
    {
      category: 'Meal Reminders',
      description: 'Get notified when it\'s time to eat',
      settings: [
        { id: 'meal_push', name: 'Push Notifications', enabled: true },
        { id: 'meal_email', name: 'Email Reminders', enabled: false },
        { id: 'meal_sms', name: 'SMS Alerts', enabled: false }
      ]
    },
    {
      category: 'Health Insights',
      description: 'AI-powered health discoveries and patterns',
      settings: [
        { id: 'insight_push', name: 'Push Notifications', enabled: true },
        { id: 'insight_email', name: 'Weekly Email Summary', enabled: true },
        { id: 'insight_sms', name: 'Critical Alerts Only', enabled: false }
      ]
    },
    {
      category: 'Goal Updates',
      description: 'Progress updates and achievements',
      settings: [
        { id: 'goal_push', name: 'Push Notifications', enabled: true },
        { id: 'goal_email', name: 'Daily Progress Email', enabled: false },
        { id: 'goal_sms', name: 'Milestone Achievements', enabled: true }
      ]
    },
    {
      category: 'Social Activity',
      description: 'Community posts and interactions',
      settings: [
        { id: 'social_push', name: 'Push Notifications', enabled: false },
        { id: 'social_email', name: 'Weekly Community Digest', enabled: true },
        { id: 'social_sms', name: 'Direct Messages Only', enabled: false }
      ]
    }
  ];

  const privacySettings = [
    {
      category: 'Data Sharing',
      items: [
        { id: 'anonymous_analytics', name: 'Anonymous Analytics', description: 'Help improve NutriGen AI with anonymous usage data', enabled: true },
        { id: 'research_participation', name: 'Research Participation', description: 'Contribute to nutrition research studies (optional)', enabled: false },
        { id: 'third_party_integrations', name: 'Third-party Integrations', description: 'Allow approved partners to access your data', enabled: true }
      ]
    },
    {
      category: 'Profile Visibility',
      items: [
        { id: 'public_profile', name: 'Public Profile', description: 'Make your profile visible to other users', enabled: false },
        { id: 'achievement_sharing', name: 'Achievement Sharing', description: 'Share your achievements with the community', enabled: true },
        { id: 'progress_visibility', name: 'Progress Visibility', description: 'Allow friends to see your progress', enabled: false }
      ]
    },
    {
      category: 'Data Retention',
      items: [
        { id: 'auto_backup', name: 'Automatic Backup', description: 'Automatically backup your data to cloud storage', enabled: true },
        { id: 'data_encryption', name: 'Enhanced Encryption', description: 'Use additional encryption for sensitive data', enabled: true },
        { id: 'data_export', name: 'Data Export Access', description: 'Allow data export in standard formats', enabled: true }
      ]
    }
  ];

  const dataManagementOptions = [
    {
      id: 'export_all',
      title: 'Export All Data',
      description: 'Download all your data in JSON format',
      action: 'Download',
      icon: Download,
      color: 'blue'
    },
    {
      id: 'export_nutrition',
      title: 'Export Nutrition Data',
      description: 'Download only nutrition and meal data',
      action: 'Download',
      icon: Download,
      color: 'green'
    },
    {
      id: 'import_data',
      title: 'Import Data',
      description: 'Import data from other nutrition apps',
      action: 'Import',
      icon: Upload,
      color: 'purple'
    },
    {
      id: 'delete_account',
      title: 'Delete Account',
      description: 'Permanently delete your account and all data',
      action: 'Delete',
      icon: Trash2,
      color: 'red'
    }
  ];

  const integrationSettings = [
    {
      service: 'Apple Health',
      connected: true,
      description: 'Sync health and fitness data',
      permissions: ['Steps', 'Heart Rate', 'Sleep', 'Weight'],
      lastSync: '2 minutes ago'
    },
    {
      service: 'Google Fit',
      connected: false,
      description: 'Activity and exercise tracking',
      permissions: ['Activity', 'Location', 'Body Measurements'],
      lastSync: 'Never'
    },
    {
      service: 'MyFitnessPal',
      connected: true,
      description: 'Food database and nutrition info',
      permissions: ['Food Diary', 'Recipes', 'Goals'],
      lastSync: '1 hour ago'
    },
    {
      service: 'Fitbit',
      connected: false,
      description: 'Wearable device data sync',
      permissions: ['Steps', 'Heart Rate', 'Sleep', 'Exercise'],
      lastSync: 'Never'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl">App Settings</h1>
              <p className="text-gray-600 text-sm">Customize your NutriGen AI experience</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-purple-600" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Dark Mode</div>
                  <div className="text-sm text-gray-600">Switch between light and dark themes</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-gray-600" />
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode}
                  />
                  <Moon className="h-4 w-4 text-gray-600" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium text-gray-900">Theme Color</div>
                <div className="flex space-x-3">
                  {[
                    { name: 'Green', color: 'bg-green-500' },
                    { name: 'Blue', color: 'bg-blue-500' },
                    { name: 'Purple', color: 'bg-purple-500' },
                    { name: 'Pink', color: 'bg-pink-500' },
                    { name: 'Orange', color: 'bg-orange-500' }
                  ].map((theme, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-full ${theme.color} ${
                        index === 0 ? 'ring-2 ring-offset-2 ring-green-500' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="font-medium text-gray-900">Font Size</div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Small</span>
                  <Slider
                    value={[16]}
                    max={24}
                    min={12}
                    step={2}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">Large</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (ET)</SelectItem>
                      <SelectItem value="cst">Central Time (CT)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Units
                  </label>
                  <Select defaultValue="imperial">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                      <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sound Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-green-600" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-600" />
                )}
                Sound & Haptics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Sound Effects</div>
                  <div className="text-sm text-gray-600">Play sounds for interactions and notifications</div>
                </div>
                <Switch 
                  checked={soundEnabled} 
                  onCheckedChange={setSoundEnabled}
                />
              </div>

              <div className="space-y-3">
                <div className="font-medium text-gray-900">Notification Volume</div>
                <Slider
                  value={[75]}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                  disabled={!soundEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Haptic Feedback</div>
                  <div className="text-sm text-gray-600">Vibrate on button taps and gestures</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {notificationSettings.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <p className="text-sm text-gray-600">{category.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {setting.name.includes('Push') && <Smartphone className="h-4 w-4 text-blue-600" />}
                      {setting.name.includes('Email') && <Mail className="h-4 w-4 text-green-600" />}
                      {setting.name.includes('SMS') && <MessageSquare className="h-4 w-4 text-purple-600" />}
                      <span className="font-medium text-gray-900">{setting.name}</span>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <p className="text-sm text-gray-600">Automatically silence notifications during these hours</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Enable Quiet Hours</span>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input 
                    type="time" 
                    defaultValue="22:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input 
                    type="time" 
                    defaultValue="07:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {privacySettings.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.description}</div>
                    </div>
                    <Switch defaultChecked={item.enabled} className="ml-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                Privacy Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Your Data is Protected</h4>
                <p className="text-sm text-gray-600 mb-3">
                  NutriGen AI uses end-to-end encryption and follows strict privacy standards to protect your health data.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Data Usage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-indigo-600" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataManagementOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.id} className={`p-4 border border-gray-200 rounded-lg hover:border-${option.color}-500 hover:bg-${option.color}-50 transition-all cursor-pointer`}>
                      <div className="flex items-start space-x-3">
                        <Icon className={`h-6 w-6 text-${option.color}-600 flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                          <Button 
                            size="sm" 
                            variant={option.color === 'red' ? 'destructive' : 'outline'}
                            className={option.color !== 'red' ? `border-${option.color}-500 text-${option.color}-600 hover:bg-${option.color}-50` : ''}
                          >
                            {option.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { category: 'Food Logs', size: '45 MB', percentage: 65 },
                  { category: 'Photos', size: '23 MB', percentage: 35 },
                  { category: 'Health Data', size: '12 MB', percentage: 20 },
                  { category: 'App Cache', size: '8 MB', percentage: 15 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900">{item.category}</span>
                      <span className="text-gray-600">{item.size}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Used</span>
                  <span className="font-medium text-gray-900">88 MB of 1 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <p className="text-sm text-gray-600">Manage your connected apps and devices</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrationSettings.map((integration, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{integration.service}</h3>
                        <Badge className={`text-xs ${
                          integration.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {integration.connected ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
                      <div className="text-xs text-gray-500">
                        Last sync: {integration.lastSync}
                      </div>
                      {integration.connected && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-600 mb-1">Permissions:</div>
                          <div className="flex flex-wrap gap-1">
                            {integration.permissions.map((permission, permIndex) => (
                              <Badge key={permIndex} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        size="sm"
                        variant={integration.connected ? "outline" : "default"}
                        className={integration.connected ? "" : "bg-gradient-to-r from-blue-500 to-purple-500"}
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                      {integration.connected && (
                        <Button size="sm" variant="outline">
                          Sync Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <p className="text-sm text-gray-600">Expert-level customization options</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Developer Mode</div>
                    <div className="text-sm text-gray-600">Enable advanced debugging features</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Beta Features</div>
                    <div className="text-sm text-gray-600">Access experimental features before public release</div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">Offline Mode</div>
                    <div className="text-sm text-gray-600">Enable core features without internet connection</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-3">
                  <div className="font-medium text-gray-900">Cache Management</div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">Clear Image Cache</Button>
                    <Button variant="outline" size="sm">Clear Data Cache</Button>
                    <Button variant="outline" size="sm">Reset App Settings</Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="font-medium text-gray-900">API Settings</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sync Frequency
                      </label>
                      <Select defaultValue="auto">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Automatic</SelectItem>
                          <SelectItem value="5min">Every 5 minutes</SelectItem>
                          <SelectItem value="15min">Every 15 minutes</SelectItem>
                          <SelectItem value="1hour">Every hour</SelectItem>
                          <SelectItem value="manual">Manual only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Quality
                      </label>
                      <Select defaultValue="high">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High (slower)</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low (faster)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Debug Logs
                </Button>
                <Button variant="outline">
                  Reset Network Settings
                </Button>
                <Button variant="outline">
                  Refresh AI Model
                </Button>
                <Button variant="outline">
                  Contact Technical Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}