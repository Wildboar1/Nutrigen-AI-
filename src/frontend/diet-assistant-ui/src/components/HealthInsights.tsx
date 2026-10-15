import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Activity, 
  Heart, 
  Zap,
  Brain,
  Moon,
  Target,
  ChevronDown,
  Info,
  Download,
  Droplets
} from 'lucide-react';
import { ProgressTracking } from './ProgressTracking';
import { WaterSupplementTracking } from './WaterSupplementTracking';

export function HealthInsights() {
  const [selectedMetric, setSelectedMetric] = useState('glucose');
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('insights');

  const metrics = [
    { id: 'glucose', label: 'Glucose Stability', icon: Activity, color: 'green', value: '92%', trend: '+5%' },
    { id: 'energy', label: 'Energy Levels', icon: Zap, color: 'yellow', value: '8.2/10', trend: '+0.3' },
    { id: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'indigo', value: '7.8/10', trend: '+0.5' },
    { id: 'mood', label: 'Mood Score', icon: Brain, color: 'purple', value: '8.5/10', trend: '+0.7' },
    { id: 'heart', label: 'HRV Score', icon: Heart, color: 'red', value: '64ms', trend: '+8ms' }
  ];

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '3 Months' },
    { id: '1y', label: '1 Year' }
  ];

  const foodResponseData = [
    {
      food: 'Oatmeal with Berries',
      date: '2024-01-15',
      glucoseSpike: '+23mg/dL',
      energyLevel: 8.5,
      duration: '2.5 hours',
      rating: 'excellent',
      notes: 'Sustained energy, no crash'
    },
    {
      food: 'White Rice Bowl',
      date: '2024-01-14',
      glucoseSpike: '+67mg/dL',
      energyLevel: 6.2,
      duration: '1.2 hours',
      rating: 'poor',
      notes: 'Sharp spike, energy crash'
    },
    {
      food: 'Salmon & Quinoa',
      date: '2024-01-13',
      glucoseSpike: '+18mg/dL',
      energyLevel: 9.1,
      duration: '3.8 hours',
      rating: 'excellent',
      notes: 'Perfect balance, felt great'
    }
  ];

  const patterns = [
    {
      title: 'Protein Timing Impact',
      description: 'Higher protein at breakfast correlates with 23% better glucose stability throughout the day',
      confidence: 94,
      timeframe: 'Last 30 days',
      actionable: 'Increase morning protein to 25-30g',
      impact: 'High'
    },
    {
      title: 'Weekend Eating Patterns',
      description: 'Saturday meals show 18% better mood scores, likely due to relaxed eating environment',
      confidence: 87,
      timeframe: 'Last 12 weeks',
      actionable: 'Apply weekend mindfulness to weekdays',
      impact: 'Medium'
    },
    {
      title: 'Magnesium & Sleep Connection',
      description: 'Days with >300mg magnesium intake show 31% improvement in deep sleep phases',
      confidence: 91,
      timeframe: 'Last 60 days',
      actionable: 'Add dark leafy greens to dinner',
      impact: 'High'
    }
  ];

  const correlations = [
    { factor1: 'Omega-3 Intake', factor2: 'Sleep Quality', strength: 0.87, type: 'positive' },
    { factor1: 'Refined Sugar', factor2: 'Energy Stability', strength: -0.73, type: 'negative' },
    { factor1: 'Fiber Intake', factor2: 'Mood Score', strength: 0.65, type: 'positive' },
    { factor1: 'Late Eating', factor2: 'HRV Score', strength: -0.58, type: 'negative' }
  ];

  const experiments = [
    {
      title: 'Intermittent Fasting Window',
      status: 'active',
      duration: '2 weeks',
      hypothesis: '16:8 fasting improves glucose stability',
      currentResults: 'Preliminary: +12% glucose stability',
      nextStep: 'Continue for 2 more weeks'
    },
    {
      title: 'Evening Carb Restriction',
      status: 'completed',
      duration: '4 weeks',
      hypothesis: 'Lower carbs after 6 PM improves sleep',
      results: 'Confirmed: +23% deep sleep improvement',
      recommendation: 'Adopt as permanent habit'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Health Insights Center</h1>
            <p className="text-gray-600 text-sm sm:text-base">Deep analysis of your nutrition patterns and biological responses</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: 'insights', label: 'Health Insights', icon: Activity },
            { id: 'water-supplements', label: 'Water & Supplements', icon: Droplets },
            { id: 'progress', label: 'Progress Tracking', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 sm:px-4 py-2 rounded-lg transition-all flex items-center justify-center space-x-1 sm:space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs sm:text-sm hidden sm:inline">{tab.label}</span>
                <span className="text-xs sm:hidden">{tab.id === 'insights' ? 'Insights' : tab.id === 'water-supplements' ? 'Water' : 'Progress'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'water-supplements' && (
        <WaterSupplementTracking />
      )}

      {activeTab === 'progress' && (
        <ProgressTracking />
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Time Range Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  {timeRanges.map((range) => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>
                <button className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <Download className="h-4 w-4" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>

        {/* Metric Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-3 sm:p-4 rounded-xl transition-all text-left ${
                  selectedMetric === metric.id
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-2 ${selectedMetric === metric.id ? 'text-white' : `text-${metric.color}-600`}`} />
                <div className="text-xs sm:text-sm opacity-90">{metric.label}</div>
                <div className="font-bold text-sm sm:text-base">{metric.value}</div>
                <div className="text-xs opacity-75">{metric.trend}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Trend Analysis</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="h-4 w-4" />
              <span>Interactive Visualization</span>
            </div>
          </div>

          {/* Simulated Chart */}
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center mb-6">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Interactive chart visualization</p>
              <p className="text-sm">Showing {selectedMetric} trends over {timeRange}</p>
            </div>
          </div>

          {/* Food Response Analysis */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Recent Food Response Analysis</h3>
            <div className="space-y-3">
              {foodResponseData.map((response, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{response.food}</h4>
                      <p className="text-sm text-gray-600">{response.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      response.rating === 'excellent' ? 'bg-green-100 text-green-800' :
                      response.rating === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {response.rating}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Glucose Spike:</span>
                      <div className="font-medium">{response.glucoseSpike}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Energy Level:</span>
                      <div className="font-medium">{response.energyLevel}/10</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-medium">{response.duration}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 italic">"{response.notes}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pattern Insights */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">AI Pattern Recognition</h3>
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{pattern.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pattern.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pattern.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                  <div className="text-xs text-gray-500 mb-2">
                    <span>Confidence: {pattern.confidence}% • {pattern.timeframe}</span>
                  </div>
                  <div className="bg-white p-2 rounded text-sm">
                    <span className="text-gray-600">Action: </span>
                    <span className="text-blue-700 font-medium">{pattern.actionable}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Correlation Explorer</h3>
            <div className="space-y-3">
              {correlations.map((corr, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{corr.factor1}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      corr.type === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {(corr.strength * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">↔ {corr.factor2}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full ${corr.type === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.abs(corr.strength) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Experiments Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Nutrition Experiments</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
            Design New Experiment
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((experiment, index) => (
            <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-gray-900">{experiment.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  experiment.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {experiment.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Duration: </span>
                  <span className="text-gray-900">{experiment.duration}</span>
                </div>
                <div>
                  <span className="text-gray-600">Hypothesis: </span>
                  <span className="text-gray-900">{experiment.hypothesis}</span>
                </div>
                {experiment.currentResults && (
                  <div>
                    <span className="text-gray-600">Current Results: </span>
                    <span className="text-green-700 font-medium">{experiment.currentResults}</span>
                  </div>
                )}
                {experiment.results && (
                  <div>
                    <span className="text-gray-600">Final Results: </span>
                    <span className="text-green-700 font-medium">{experiment.results}</span>
                  </div>
                )}
                <div className="pt-2">
                  <span className="text-gray-600">Next Step: </span>
                  <span className="text-blue-700 font-medium">
                    {experiment.nextStep || experiment.recommendation}
                  </span>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
        </div>
      )}
    </div>
  );
}