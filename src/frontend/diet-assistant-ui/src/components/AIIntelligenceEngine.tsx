import React, { useState } from 'react';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Dna,
  TestTube2,
  Heart,
  Pill,
  MapPin,
  Calendar,
  Settings,
  Info,
  BarChart3,
  Activity,
  Gauge,
  Shield,
  Lightbulb,
  Layers,
  GitBranch,
  Microscope,
  FlaskConical
} from 'lucide-react';

export function AIIntelligenceEngine() {
  const [selectedModel, setSelectedModel] = useState('metabolic');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const aiModels = [
    {
      id: 'metabolic',
      name: 'Metabolic Profiler',
      description: 'Personal metabolic pattern analysis and glucose response prediction',
      confidence: 94,
      dataPoints: 15420,
      lastTrained: '2 hours ago',
      accuracy: 91.7,
      status: 'active'
    },
    {
      id: 'micronutrient',
      name: 'Micronutrient Optimizer',
      description: 'Deficiency risk assessment and personalized supplementation',
      confidence: 87,
      dataPoints: 8760,
      lastTrained: '6 hours ago',
      accuracy: 89.3,
      status: 'active'
    },
    {
      id: 'pattern',
      name: 'Pattern Recognition',
      description: 'Cross-population biological profile matching and insights',
      confidence: 82,
      dataPoints: 124800,
      lastTrained: '1 day ago',
      accuracy: 85.6,
      status: 'training'
    },
    {
      id: 'contraindication',
      name: 'Safety Checker',
      description: 'Medication and condition contraindication analysis',
      confidence: 98,
      dataPoints: 5240,
      lastTrained: '30 minutes ago',
      accuracy: 96.2,
      status: 'active'
    }
  ];

  const contextualFactors = [
    {
      factor: 'Circadian Rhythm',
      impact: 'High',
      value: 'Morning Peak (8:30 AM)',
      description: 'Optimal glucose tolerance window identified',
      confidence: 92
    },
    {
      factor: 'Stress Level',
      impact: 'Medium',
      value: 'Elevated (HRV: 28ms)',
      description: 'May increase insulin resistance by 15%',
      confidence: 78
    },
    {
      factor: 'Sleep Quality',
      impact: 'High',
      value: 'Good (8.2h, 89% efficiency)',
      description: 'Supports normal metabolic function',
      confidence: 89
    },
    {
      factor: 'Location Context',
      impact: 'Low',
      value: 'Home Environment',
      description: 'Familiar food preparation setting',
      confidence: 95
    },
    {
      factor: 'Exercise State',
      impact: 'Medium',
      value: 'Post-workout (2h ago)',
      description: 'Enhanced glucose uptake window active',
      confidence: 85
    }
  ];

  const metabolicProfile = {
    glucoseResponse: {
      baseline: 89,
      peak: 142,
      timeToBaseline: 187,
      auc: 8420
    },
    macronutrientSensitivity: {
      carbs: { tolerance: 'moderate', optimal: '35-45g' },
      protein: { tolerance: 'high', optimal: '25-35g' },
      fat: { tolerance: 'high', optimal: '15-25g' }
    },
    metabolicType: 'Mixed Oxidizer',
    insulinSensitivity: 7.2,
    inflammationRisk: 'low'
  };

  const micronutrientAnalysis = [
    {
      nutrient: 'Magnesium',
      status: 'deficient',
      currentIntake: 287,
      recommended: 420,
      riskScore: 8.2,
      sources: ['Dark leafy greens', 'Nuts', 'Seeds'],
      impact: 'Sleep quality, glucose metabolism'
    },
    {
      nutrient: 'Omega-3 EPA',
      status: 'suboptimal',
      currentIntake: 0.8,
      recommended: 1.5,
      riskScore: 6.7,
      sources: ['Fatty fish', 'Algae oil', 'Walnuts'],
      impact: 'Inflammation, brain health'
    },
    {
      nutrient: 'Vitamin D',
      status: 'optimal',
      currentIntake: 2400,
      recommended: 2000,
      riskScore: 2.1,
      sources: ['Sunlight', 'Fortified foods', 'Supplements'],
      impact: 'Bone health, immune function'
    },
    {
      nutrient: 'Fiber',
      status: 'suboptimal',
      currentIntake: 22,
      recommended: 35,
      riskScore: 5.8,
      sources: ['Vegetables', 'Fruits', 'Whole grains'],
      impact: 'Gut health, glucose stability'
    }
  ];

  const patternInsights = [
    {
      pattern: 'Similar Metabolic Profile Match',
      matchScore: 87,
      populationSize: 1247,
      insight: 'Users with similar glucose patterns benefit from 16:8 intermittent fasting',
      evidence: 'Average HbA1c improvement: -0.8%',
      recommendation: 'Consider time-restricted eating window'
    },
    {
      pattern: 'Genetic Variant Response',
      matchScore: 94,
      populationSize: 342,
      insight: 'Your APOE4 variant suggests higher omega-3 requirements',
      evidence: 'Optimal EPA/DHA ratio: 2:1 vs standard 1:1',
      recommendation: 'Increase EPA-rich fish consumption'
    },
    {
      pattern: 'Microbiome Similarity',
      matchScore: 73,
      populationSize: 892,
      insight: 'Prevotella-dominant microbiome responds well to high-fiber diets',
      evidence: 'SCFA production increases 40% with >30g fiber/day',
      recommendation: 'Prioritize prebiotic-rich vegetables'
    }
  ];

  const contraindications = [
    {
      type: 'Medication Interaction',
      severity: 'high',
      item: 'Metformin + High Fiber',
      description: 'High fiber meals may reduce metformin absorption by 25%',
      recommendation: 'Take medication 2 hours before high-fiber meals',
      source: 'Clinical studies'
    },
    {
      type: 'Condition Consideration',
      severity: 'medium',
      item: 'GERD + Citrus',
      description: 'Citrus fruits may trigger acid reflux symptoms',
      recommendation: 'Limit citrus to 1 serving daily, preferably morning',
      source: 'Medical history'
    },
    {
      type: 'Allergy Alert',
      severity: 'high',
      item: 'Tree Nut Sensitivity',
      description: 'Cross-contamination risk in processed foods',
      recommendation: 'Verify manufacturing processes for nut-free facilities',
      source: 'User profile'
    }
  ];

  const adaptiveLearning = {
    recentFeedback: [
      { meal: 'Quinoa bowl', rating: 9, glucose: 'stable', energy: 'high', learned: 'Increase quinoa portion' },
      { meal: 'Pasta dinner', rating: 4, glucose: 'spike', energy: 'crash', learned: 'Reduce refined carbs evening' },
      { meal: 'Salmon lunch', rating: 8, glucose: 'optimal', energy: 'sustained', learned: 'Maintain protein timing' }
    ],
    adjustments: 12,
    confidence: 89,
    nextCalibration: '3 days'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deficient': return 'text-red-600 bg-red-100';
      case 'suboptimal': return 'text-yellow-600 bg-yellow-100';
      case 'optimal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Intelligence Engine</h1>
            <p className="text-gray-600">Advanced personalized nutrition AI system powering your recommendations</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Technical Details</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Model Training</span>
            </button>
          </div>
        </div>

        {/* AI Model Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {aiModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-4 rounded-xl text-left transition-all ${
                selectedModel === model.id 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Cpu className={`h-5 w-5 ${selectedModel === model.id ? 'text-white' : 'text-gray-600'}`} />
                <div className={`flex items-center space-x-1 ${
                  model.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                  <span className="text-xs capitalize">{model.status}</span>
                </div>
              </div>
              <h3 className={`font-bold mb-1 ${selectedModel === model.id ? 'text-white' : 'text-gray-900'}`}>
                {model.name}
              </h3>
              <p className={`text-sm mb-3 ${selectedModel === model.id ? 'text-green-100' : 'text-gray-600'}`}>
                {model.description}
              </p>
              <div className="space-y-1 text-xs">
                <div className={`flex justify-between ${selectedModel === model.id ? 'text-white' : 'text-gray-700'}`}>
                  <span>Confidence:</span>
                  <span>{model.confidence}%</span>
                </div>
                <div className={`flex justify-between ${selectedModel === model.id ? 'text-white' : 'text-gray-700'}`}>
                  <span>Accuracy:</span>
                  <span>{model.accuracy}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Analysis Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Metabolic Profile */}
          {selectedModel === 'metabolic' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Personal Metabolic Profile</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Activity className="h-4 w-4" />
                  <span>Live Analysis</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-900">{metabolicProfile.glucoseResponse.baseline}</div>
                  <div className="text-sm text-blue-700">Baseline Glucose (mg/dL)</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-900">{metabolicProfile.glucoseResponse.timeToBaseline}</div>
                  <div className="text-sm text-green-700">Return Time (min)</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-900">{metabolicProfile.insulinSensitivity}</div>
                  <div className="text-sm text-purple-700">Insulin Sensitivity</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-900">{metabolicProfile.metabolicType}</div>
                  <div className="text-sm text-orange-700">Metabolic Type</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-900">Macronutrient Sensitivity Analysis</h3>
                {Object.entries(metabolicProfile.macronutrientSensitivity).map(([macro, data]) => (
                  <div key={macro} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900 capitalize">{macro}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        data.tolerance === 'high' ? 'bg-green-100 text-green-800' :
                        data.tolerance === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {data.tolerance} tolerance
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Optimal range: <span className="font-medium text-gray-900">{data.optimal}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Micronutrient Analysis */}
          {selectedModel === 'micronutrient' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Micronutrient Optimization</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FlaskConical className="h-4 w-4" />
                  <span>AI Analysis</span>
                </div>
              </div>

              <div className="space-y-4">
                {micronutrientAnalysis.map((nutrient, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{nutrient.nutrient}</h3>
                        <p className="text-sm text-gray-600">{nutrient.impact}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(nutrient.status)}`}>
                          {nutrient.status}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">Risk: {nutrient.riskScore}/10</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Current: </span>
                        <span className="font-medium text-gray-900">{nutrient.currentIntake}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Target: </span>
                        <span className="font-medium text-gray-900">{nutrient.recommended}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-gray-600">Best sources: </span>
                      <span className="text-sm text-gray-900">{nutrient.sources.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pattern Recognition */}
          {selectedModel === 'pattern' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Population Pattern Insights</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Cross-Population Analysis</span>
                </div>
              </div>

              <div className="space-y-4">
                {patternInsights.map((pattern, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900">{pattern.pattern}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{pattern.matchScore}%</div>
                        <div className="text-xs text-gray-600">match</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      Population size: <span className="font-medium text-gray-900">{pattern.populationSize.toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{pattern.insight}</p>
                    
                    <div className="p-3 bg-white rounded-lg mb-2">
                      <span className="text-sm text-gray-600">Evidence: </span>
                      <span className="text-sm font-medium text-gray-900">{pattern.evidence}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900">{pattern.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contraindication Checker */}
          {selectedModel === 'contraindication' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Safety Analysis & Contraindications</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Safety First</span>
                </div>
              </div>

              <div className="space-y-4">
                {contraindications.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`h-5 w-5 ${
                          item.severity === 'high' ? 'text-red-500' : 
                          item.severity === 'medium' ? 'text-yellow-500' : 
                          'text-gray-500'
                        }`} />
                        <h3 className="font-bold text-gray-900">{item.item}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                        {item.severity} priority
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{item.description}</p>
                    
                    <div className="p-3 bg-blue-50 rounded-lg mb-2">
                      <span className="text-sm text-blue-600 font-medium">Recommendation: </span>
                      <span className="text-sm text-gray-900">{item.recommendation}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Source: {item.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Contextual Factors */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Contextual Awareness</h3>
            <div className="space-y-3">
              {contextualFactors.map((factor, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      factor.impact === 'High' ? 'bg-red-100 text-red-800' :
                      factor.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {factor.impact}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">{factor.value}</div>
                  <div className="text-xs text-gray-600 mb-2">{factor.description}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Confidence</span>
                    <span>{factor.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Learning */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Adaptive Learning</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-900">{adaptiveLearning.adjustments}</div>
                  <div className="text-xs text-blue-700">Model Adjustments</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-900">{adaptiveLearning.confidence}%</div>
                  <div className="text-xs text-green-700">Learning Confidence</div>
                </div>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-900 block mb-2">Recent Feedback Integration:</span>
                <div className="space-y-2">
                  {adaptiveLearning.recentFeedback.map((feedback, index) => (
                    <div key={index} className="text-xs p-2 bg-gray-50 rounded">
                      <div className="font-medium text-gray-900">{feedback.meal}</div>
                      <div className="text-gray-600">{feedback.learned}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-600">Next calibration: </span>
                <span className="font-medium text-gray-900">{adaptiveLearning.nextCalibration}</span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          {showTechnicalDetails && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Technical Specifications</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Architecture: </span>
                  <span className="text-gray-900">Transformer + CNN Hybrid</span>
                </div>
                <div>
                  <span className="text-gray-600">Training Data: </span>
                  <span className="text-gray-900">2.3M meal records</span>
                </div>
                <div>
                  <span className="text-gray-600">Update Frequency: </span>
                  <span className="text-gray-900">Real-time + Daily batch</span>
                </div>
                <div>
                  <span className="text-gray-600">Privacy: </span>
                  <span className="text-gray-900">Federated learning</span>
                </div>
                <div>
                  <span className="text-gray-600">Latency: </span>
                  <span className="text-gray-900">&lt;200ms prediction</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}