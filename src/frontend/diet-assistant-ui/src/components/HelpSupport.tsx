import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Phone, 
  Mail,
  BookOpen,
  Video,
  FileText,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function HelpSupport() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', name: 'All Topics', count: 45 },
    { id: 'getting-started', name: 'Getting Started', count: 12 },
    { id: 'food-logging', name: 'Food Logging', count: 8 },
    { id: 'ai-features', name: 'AI Features', count: 6 },
    { id: 'data-privacy', name: 'Data & Privacy', count: 7 },
    { id: 'account', name: 'Account Settings', count: 5 },
    { id: 'troubleshooting', name: 'Troubleshooting', count: 7 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How does the AI personalization work?',
      answer: 'Our AI analyzes your unique data including glucose responses, sleep patterns, activity levels, and food preferences to create personalized nutrition recommendations. The more data you provide, the more accurate the recommendations become.',
      helpful: 45,
      notHelpful: 3,
      tags: ['AI', 'personalization', 'data']
    },
    {
      id: 2,
      category: 'food-logging',
      question: 'Can I take photos of my meals for automatic logging?',
      answer: 'Yes! Our computer vision technology can identify foods in your photos and automatically log nutrition information. Simply tap the camera icon and take a photo of your meal. The AI will analyze the image and add the foods to your diary.',
      helpful: 38,
      notHelpful: 2,
      tags: ['camera', 'logging', 'computer vision']
    },
    {
      id: 3,
      category: 'ai-features',
      question: 'What makes NutriGen AI different from other nutrition apps?',
      answer: 'NutriGen AI integrates multiple data sources (glucose monitors, wearables, microbiome data) and uses advanced AI to provide truly personalized recommendations. Unlike one-size-fits-all approaches, our system learns your unique metabolic responses.',
      helpful: 52,
      notHelpful: 1,
      tags: ['features', 'personalization', 'integration']
    },
    {
      id: 4,
      category: 'data-privacy',
      question: 'How is my health data protected?',
      answer: 'Your data is encrypted end-to-end and stored securely in compliance with HIPAA regulations. We never sell your personal information, and you have full control over what data you share. You can export or delete your data at any time.',
      helpful: 67,
      notHelpful: 0,
      tags: ['privacy', 'security', 'HIPAA']
    },
    {
      id: 5,
      category: 'troubleshooting',
      question: 'My glucose monitor isn\'t syncing. What should I do?',
      answer: 'First, ensure your device is connected to WiFi and Bluetooth is enabled. Try disconnecting and reconnecting in the Data Integration section. If issues persist, check if your device needs a firmware update or contact our support team.',
      helpful: 29,
      notHelpful: 4,
      tags: ['glucose monitor', 'syncing', 'troubleshooting']
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with NutriGen AI',
      description: 'Complete setup guide for new users',
      duration: '8 min',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
      viewed: false
    },
    {
      id: 2,
      title: 'Food Logging Best Practices',
      description: 'Tips for accurate and efficient food tracking',
      duration: '5 min',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300&h=200&fit=crop',
      viewed: true
    },
    {
      id: 3,
      title: 'Understanding Your AI Insights',
      description: 'How to interpret personalized recommendations',
      duration: '12 min',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=300&h=200&fit=crop',
      viewed: false
    },
    {
      id: 4,
      title: 'Connecting Wearable Devices',
      description: 'Step-by-step device integration guide',
      duration: '6 min',
      type: 'article',
      thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
      viewed: false
    }
  ];

  const supportTickets = [
    {
      id: 'T-001245',
      subject: 'App crashes when taking food photos',
      status: 'In Progress',
      priority: 'High',
      created: '2024-06-20',
      lastUpdate: '2 hours ago',
      responses: 3
    },
    {
      id: 'T-001223',
      subject: 'Unable to sync Apple Health data',
      status: 'Resolved',
      priority: 'Medium',
      created: '2024-06-18',
      lastUpdate: '1 day ago',
      responses: 5
    },
    {
      id: 'T-001198',
      subject: 'Question about meal recommendations',
      status: 'Closed',
      priority: 'Low',
      created: '2024-06-15',
      lastUpdate: '3 days ago',
      responses: 2
    }
  ];

  const contactOptions = [
    {
      type: 'chat',
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: 'Available now',
      responseTime: 'Usually responds in 2-3 minutes',
      icon: MessageCircle,
      color: 'green'
    },
    {
      type: 'email',
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Always available',
      responseTime: 'Usually responds within 24 hours',
      icon: Mail,
      color: 'blue'
    },
    {
      type: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with our team',
      availability: 'Mon-Fri 9AM-5PM EST',
      responseTime: 'Immediate assistance',
      icon: Phone,
      color: 'purple'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl">Help & Support</h1>
              <p className="text-gray-600 text-sm">Find answers and get help when you need it</p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-xs"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id.toString()}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <p className="text-gray-700">{faq.answer}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-sm text-gray-600">
                          Was this helpful?
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {faq.helpful}
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {faq.notHelpful}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials & Guides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tutorial) => (
                  <div key={tutorial.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="relative">
                      <img 
                        src={tutorial.thumbnail} 
                        alt={tutorial.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        {tutorial.type === 'video' ? (
                          <Video className="h-8 w-8 text-white" />
                        ) : (
                          <FileText className="h-8 w-8 text-white" />
                        )}
                      </div>
                      {tutorial.viewed && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {tutorial.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{tutorial.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {contactOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.type} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 rounded-full bg-${option.color}-100 inline-block mb-4`}>
                      <Icon className={`h-8 w-8 text-${option.color}-600`} />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">{option.availability}</div>
                      <div className="text-xs text-gray-500">{option.responseTime}</div>
                    </div>
                    <Button className={`w-full mt-4 bg-gradient-to-r from-${option.color}-500 to-${option.color}-600`}>
                      Contact Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>General Question</option>
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                    <option>Account Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Describe your question or issue in detail..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  We typically respond within 24 hours
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Support Tickets
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                  Create New Ticket
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-gray-900">#{ticket.id}</span>
                          <Badge className={`text-xs ${
                            ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status}
                          </Badge>
                          <Badge className={`text-xs ${
                            ticket.priority === 'High' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {ticket.priority}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Created: {ticket.created}</span>
                          <span>Last update: {ticket.lastUpdate}</span>
                          <span>{ticket.responses} responses</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span>User Manual</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Complete guide to using all NutriGen AI features
                </p>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>API Documentation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Technical documentation for developers
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  <span>Privacy Policy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  How we protect and handle your data
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read Policy
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Real-time status of all NutriGen AI services
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  <span>Release Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Latest updates and new features
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Updates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-pink-600" />
                  <span>Community Forum</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Connect with other users and share tips
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Join Forum
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}