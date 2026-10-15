import React, { useState } from 'react';
import { 
  TrendingUp, 
  Camera, 
  Scale, 
  Ruler, 
  Target, 
  Calendar,
  Plus,
  Edit,
  Trophy,
  Zap,
  Heart,
  Activity,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function ProgressTracking() {
  const [activeTab, setActiveTab] = useState('overview');

  const weightData = [
    { date: '2024-01', weight: 165, goal: 160 },
    { date: '2024-02', weight: 164, goal: 160 },
    { date: '2024-03', weight: 162.5, goal: 160 },
    { date: '2024-04', weight: 161.8, goal: 160 },
    { date: '2024-05', weight: 160.5, goal: 160 },
    { date: '2024-06', weight: 159.8, goal: 160 }
  ];

  const bodyFatData = [
    { date: '2024-01', bodyFat: 18.5 },
    { date: '2024-02', bodyFat: 17.8 },
    { date: '2024-03', bodyFat: 17.2 },
    { date: '2024-04', bodyFat: 16.9 },
    { date: '2024-05', bodyFat: 16.5 },
    { date: '2024-06', bodyFat: 16.1 }
  ];

  const measurements = [
    { part: 'Waist', current: 32.5, previous: 34.0, unit: 'inches', change: -1.5 },
    { part: 'Chest', current: 42.0, previous: 41.5, unit: 'inches', change: +0.5 },
    { part: 'Arms', current: 15.5, previous: 15.0, unit: 'inches', change: +0.5 },
    { part: 'Thighs', current: 24.0, previous: 24.5, unit: 'inches', change: -0.5 }
  ];

  const goals = [
    {
      id: 1,
      title: 'Reach Target Weight',
      target: '160 lbs',
      current: '159.8 lbs',
      progress: 95,
      deadline: '2024-07-15',
      category: 'Weight Loss',
      status: 'on-track'
    },
    {
      id: 2,
      title: 'Body Fat Percentage',
      target: '15%',
      current: '16.1%',
      progress: 78,
      deadline: '2024-08-01',
      category: 'Body Composition',
      status: 'on-track'
    },
    {
      id: 3,
      title: 'Daily Protein Intake',
      target: '150g',
      current: '142g',
      progress: 85,
      deadline: '2024-06-30',
      category: 'Nutrition',
      status: 'behind'
    },
    {
      id: 4,
      title: 'Workout Consistency',
      target: '5 days/week',
      current: '4.2 days/week',
      progress: 84,
      deadline: '2024-07-01',
      category: 'Fitness',
      status: 'on-track'
    }
  ];

  const achievements = [
    {
      title: '5 lb Weight Loss',
      description: 'Lost 5 pounds in 2 months',
      date: '2024-06-15',
      icon: Trophy,
      color: 'yellow'
    },
    {
      title: 'Consistency Champion',
      description: '30 days of food logging',
      date: '2024-06-10',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Protein Goal Master',
      description: 'Hit protein goals 7 days straight',
      date: '2024-06-05',
      icon: Zap,
      color: 'blue'
    }
  ];

  const healthMetrics = [
    { label: 'Resting Heart Rate', value: '58', unit: 'bpm', trend: 'down', status: 'excellent' },
    { label: 'Blood Pressure', value: '118/75', unit: 'mmHg', trend: 'stable', status: 'good' },
    { label: 'Sleep Quality', value: '8.2', unit: '/10', trend: 'up', status: 'excellent' },
    { label: 'Energy Levels', value: '7.8', unit: '/10', trend: 'up', status: 'good' }
  ];

  const progressPhotos = [
    { date: '2024-01-01', type: 'front', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop' },
    { date: '2024-03-01', type: 'front', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop' },
    { date: '2024-06-01', type: 'front', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=300&fit=crop' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl">Progress Tracking</h1>
                <p className="text-gray-600 text-sm">Monitor your health and fitness journey</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-500 to-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              Log Progress
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Scale className="h-8 w-8 text-blue-600" />
                  <Badge className="bg-green-100 text-green-800">-5.2 lbs</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">159.8</div>
                <div className="text-sm text-gray-600">Current Weight (lbs)</div>
                <div className="mt-2 text-xs text-green-600">Goal: 160 lbs</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <Badge className="bg-green-100 text-green-800">-2.4%</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">16.1%</div>
                <div className="text-sm text-gray-600">Body Fat</div>
                <div className="mt-2 text-xs text-green-600">Goal: 15%</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                  <Badge className="bg-blue-100 text-blue-800">Stable</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">58</div>
                <div className="text-sm text-gray-600">Resting HR (bpm)</div>
                <div className="mt-2 text-xs text-blue-600">Excellent range</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="h-8 w-8 text-yellow-600" />
                  <Badge className="bg-green-100 text-green-800">+0.8</Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">7.8</div>
                <div className="text-sm text-gray-600">Energy Level (/10)</div>
                <div className="mt-2 text-xs text-green-600">Improving</div>
              </CardContent>
            </Card>
          </div>

          {/* Weight Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="goal" 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Achievements
                <Button variant="outline" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`p-3 rounded-lg bg-${achievement.color}-100`}>
                        <Icon className={`h-6 w-6 text-${achievement.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={weightData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.1}
                        strokeWidth={3}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="goal" 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">159.8 lbs</div>
                    <div className="text-sm text-gray-600">Current Weight</div>
                    <div className="text-sm text-green-600 mt-1">-0.3 lbs this week</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Goal Weight</span>
                      <span className="text-sm font-medium">160 lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Lost</span>
                      <span className="text-sm font-medium text-green-600">-5.2 lbs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">To Goal</span>
                      <span className="text-sm font-medium text-blue-600">+0.2 lbs</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Scale className="h-4 w-4 mr-2" />
                    Log Weight
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Body Fat Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={bodyFatData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-4">
                    <div className="text-xl font-bold text-gray-900">16.1%</div>
                    <div className="text-sm text-gray-600">Current Body Fat</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Body Measurements
                <Button>
                  <Ruler className="h-4 w-4 mr-2" />
                  Add Measurement
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {measurements.map((measurement, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">{measurement.part}</h3>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {measurement.current} {measurement.unit}
                          </div>
                          <div className="text-sm text-gray-600">Current</div>
                        </div>
                        <div className={`text-sm font-medium ${
                          measurement.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {measurement.change > 0 ? '+' : ''}{measurement.change} {measurement.unit}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Previous: {measurement.previous} {measurement.unit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Active Goals
                <Button>
                  <Target className="h-4 w-4 mr-2" />
                  New Goal
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{goal.title}</h3>
                          <Badge 
                            className={`text-xs ${
                              goal.status === 'on-track' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {goal.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">{goal.category}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <div>
                          <span className="text-gray-600">Current: </span>
                          <span className="font-medium">{goal.current}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Target: </span>
                          <span className="font-medium">{goal.target}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Deadline: {goal.deadline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Progress Photos
                <Button>
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {progressPhotos.map((photo, index) => (
                  <div key={index} className="space-y-3">
                    <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={`Progress ${photo.date}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{photo.date}</div>
                      <div className="text-sm text-gray-600 capitalize">{photo.type} view</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-medium text-gray-900 mb-2">Photo Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Take photos at the same time of day</li>
                  <li>• Use consistent lighting and background</li>
                  <li>• Stand in the same position for each photo</li>
                  <li>• Take front, side, and back views</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}