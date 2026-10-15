import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp,
  Target,
  Activity,
  Zap,
  Heart,
  Scale,
  Utensils,
  Clock,
  Award,
  Share2,
  Filter,
  Mail,
  Printer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import './ReportsAnalytics.css';

// Recharts typings return ReactNode, so cast to keep TS happy with React 18.
const PolarAngleAxisComponent = PolarAngleAxis as unknown as React.ComponentType<any>;

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const nutritionData = [
    { date: '2024-06-01', calories: 1850, protein: 120, carbs: 180, fat: 65, fiber: 28 },
    { date: '2024-06-02', calories: 1920, protein: 115, carbs: 195, fat: 72, fiber: 25 },
    { date: '2024-06-03', calories: 1780, protein: 125, carbs: 165, fat: 58, fiber: 32 },
    { date: '2024-06-04', calories: 2050, protein: 135, carbs: 210, fat: 78, fiber: 30 },
    { date: '2024-06-05', calories: 1890, protein: 118, carbs: 175, fat: 68, fiber: 27 },
    { date: '2024-06-06', calories: 1960, protein: 128, carbs: 185, fat: 70, fiber: 29 },
    { date: '2024-06-07', calories: 1840, protein: 122, carbs: 170, fat: 62, fiber: 31 }
  ];

  const macroDistribution = [
    { name: 'Protein', value: 25, color: '#3b82f6' },
    { name: 'Carbs', value: 45, color: '#10b981' },
    { name: 'Fat', value: 30, color: '#8b5cf6' }
  ];

  const healthMetricsData = [
    { metric: 'Energy Level', current: 85, target: 90, max: 100 },
    { metric: 'Sleep Quality', current: 78, target: 85, max: 100 },
    { metric: 'Mood Score', current: 82, target: 88, max: 100 },
    { metric: 'Digestion', current: 90, target: 85, max: 100 },
    { metric: 'Focus', current: 75, target: 80, max: 100 },
    { metric: 'Hydration', current: 88, target: 90, max: 100 }
  ];

  const weeklyGoals = [
    { goal: 'Daily Protein Target', progress: 85, current: '127g', target: '150g' },
    { goal: 'Hydration Goal', progress: 92, current: '2.3L', target: '2.5L' },
    { goal: 'Meal Consistency', progress: 78, current: '5.5 days', target: '7 days' },
    { goal: 'Vegetable Servings', progress: 70, current: '3.5 servings', target: '5 servings' },
    { goal: 'Omega-3 Intake', progress: 95, current: '1.9g', target: '2g' }
  ];

  const insights = [
    {
      type: 'achievement',
      title: 'Protein Consistency Improving',
      description: 'You\'ve hit your protein goal 6 out of 7 days this week - a 20% improvement!',
      impact: 'High',
      icon: Award,
      color: 'green'
    },
    {
      type: 'pattern',
      title: 'Weekend Nutrition Pattern',
      description: 'Your fiber intake drops by 25% on weekends. Consider planning fiber-rich snacks.',
      impact: 'Medium',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      type: 'recommendation',
      title: 'Magnesium Optimization',
      description: 'Adding 50mg more magnesium could improve your sleep quality scores.',
      impact: 'Medium',
      icon: Zap,
      color: 'purple'
    },
    {
      type: 'warning',
      title: 'Hydration Inconsistency',
      description: 'Your water intake varies by 40% day-to-day. Set consistent reminders.',
      impact: 'Low',
      icon: Activity,
      color: 'yellow'
    }
  ];

  const exportOptions = [
    { id: 'pdf', name: 'PDF Report', description: 'Comprehensive health report', icon: FileText },
    { id: 'csv', name: 'CSV Data', description: 'Raw nutrition data for analysis', icon: Download },
    { id: 'email', name: 'Email Summary', description: 'Weekly summary to your email', icon: Mail },
    { id: 'print', name: 'Print Report', description: 'Printer-friendly version', icon: Printer }
  ];

  const summaryStats = {
    totalCalories: 13290,
    avgDaily: 1899,
    proteinGoalDays: 23,
    hydrationStreak: 12,
    mealsLogged: 89,
    weightChange: -2.3,
    energyImprovement: 15,
    sleepQuality: 82
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl">Reports & Analytics</h1>
                <p className="text-gray-600 text-sm">Comprehensive insights into your health journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 3 months</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Utensils className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{summaryStats.totalCalories.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Calories</div>
                <div className="text-xs text-blue-600 mt-1">~{summaryStats.avgDaily} daily avg</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{summaryStats.proteinGoalDays}</div>
                <div className="text-sm text-gray-600">Protein Goal Days</div>
                <div className="text-xs text-green-600 mt-1">77% success rate</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Scale className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{summaryStats.weightChange}</div>
                <div className="text-sm text-gray-600">Weight Change (lbs)</div>
                <div className="text-xs text-purple-600 mt-1">On track</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">+{summaryStats.energyImprovement}%</div>
                <div className="text-sm text-gray-600">Energy Improvement</div>
                <div className="text-xs text-yellow-600 mt-1">vs last month</div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>30-Day Nutrition Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <ResponsiveContainer>
                  <LineChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Macro Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={macroDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {macroDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {macroDistribution.map((macro, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full color-indicator color-${macro.name.toLowerCase()}`}
                      />
                      <span className="text-sm text-gray-600">{macro.name}: {macro.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">12-Day Hydration Streak</div>
                    <div className="text-sm text-gray-600">Personal best!</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Weekly Protein Goal</div>
                    <div className="text-sm text-gray-600">6 out of 7 days</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">Energy Level Up</div>
                    <div className="text-sm text-gray-600">15% improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Nutrition Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="protein" fill="#3b82f6" />
                    <Bar dataKey="carbs" fill="#10b981" />
                    <Bar dataKey="fat" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Micronutrient Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Vitamin D', current: 85, target: 100, unit: 'IU' },
                  { name: 'Iron', current: 92, target: 100, unit: 'mg' },
                  { name: 'Calcium', current: 78, target: 100, unit: 'mg' },
                  { name: 'Vitamin B12', current: 95, target: 100, unit: 'μg' },
                  { name: 'Folate', current: 82, target: 100, unit: 'μg' }
                ].map((nutrient, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">{nutrient.name}</span>
                      <span className="text-sm text-gray-600">{nutrient.current}% of RDA</span>
                    </div>
                    <Progress value={nutrient.current} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Calorie Distribution by Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { meal: 'Breakfast', calories: 450, percentage: 24 },
                  { meal: 'Lunch', calories: 520, percentage: 28 },
                  { meal: 'Dinner', calls: 640, percentage: 34 },
                  { meal: 'Snacks', calories: 289, percentage: 14 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="meal" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={healthMetricsData}>
                  <PolarGrid />
                  <PolarAngleAxisComponent dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Current"
                    dataKey="current"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Target"
                    dataKey="target"
                    stroke="#10b981"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetricsData.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{metric.metric}</h3>
                    <Badge className={`${
                      metric.current >= metric.target ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {metric.current >= metric.target ? 'On Track' : 'Improving'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {metric.current}%</span>
                      <span>Target: {metric.target}%</span>
                    </div>
                    <Progress value={metric.current} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Goal Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {weeklyGoals.map((goal, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{goal.goal}</h3>
                      <div className="text-sm text-gray-600">
                        {goal.current} / {goal.target}
                      </div>
                    </div>
                    <Badge className={`${
                      goal.progress >= 85 ? 'bg-green-100 text-green-800' :
                      goal.progress >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {goal.progress}%
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Goal Achievement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { week: 'W1', achieved: 3, total: 5 },
                    { week: 'W2', achieved: 4, total: 5 },
                    { week: 'W3', achieved: 4, total: 5 },
                    { week: 'W4', achieved: 5, total: 5 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="achieved" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Focus Area: Consistency</h4>
                  <p className="text-sm text-gray-600">
                    Your weekend nutrition consistency could improve. Consider meal prepping on Fridays.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Strength: Hydration</h4>
                  <p className="text-sm text-gray-600">
                    Excellent hydration habits! You're 95% consistent with your daily water goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-${insight.color}-100 flex-shrink-0`}>
                        <Icon className={`h-6 w-6 text-${insight.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <Badge className={`${
                            insight.impact === 'High' ? 'bg-red-100 text-red-800' :
                            insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {insight.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                          <Button size="sm" variant="outline">
                            Apply Suggestion
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Your Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div key={option.id} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-6 w-6 text-indigo-600" />
                        <div>
                          <div className="font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}