'use client'

import { useState, useEffect, useCallback } from 'react'
import { Code2, Trophy, Flame, Target, Users, Building2, Menu, X, Play, Send, RotateCcw, ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, Zap, Brain, TrendingUp, Award, Search, Filter, Sun, Moon, User, LogOut, LogIn, UserPlus, Settings, BarChart3, Calendar, Star, Eye, EyeOff } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

// Types
interface User {
  id: string
  username: string
  email: string
  avatar?: string | null
  streakCount: number
  totalSolved: number
  lastActive: string
  createdAt: string
}

interface Problem {
  id: string
  title: string
  slug: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  topic: string
  acceptance: number
  frequency: number
  companies: { name: string; slug: string; frequency: number }[]
  description?: string
  constraints?: string | string[]
  examples?: string | { input: string; output: string; explanation?: string }[]
  starterCode?: string | Record<string, string>
  hints?: string | string[]
  testCases?: { input: string; expectedOutput: string; isHidden: boolean }[]
}

interface Submission {
  id: string
  problemId: string
  code: string
  language: string
  status: string
  runtime: number | null
  memory: number | null
  createdAt: string
}

interface CompanyProblem {
  id: string
  title: string
  slug: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  topic: string
  acceptance: number
  frequency: number
  lastAsked?: string | null
  submissionCount: number
}

interface Company {
  id: string
  name: string
  slug: string
  logo?: string | null
  problemCount?: number
  problems?: CompanyProblem[]
}

interface RunResult {
  success: boolean
  error?: string
  results: {
    testCase: number
    input: string
    expectedOutput: string
    actualOutput: string
    passed: boolean
    executionTime: number
  }[]
  summary: {
    passed: number
    total: number
    allPassed: boolean
  }
}

// Topic colors
const topicColors: Record<string, string> = {
  ARRAYS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  LINKED_LISTS: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  TREES: 'bg-green-500/20 text-green-400 border-green-500/30',
  GRAPHS: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  STACKS: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  QUEUES: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  HEAPS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  HASH_TABLES: 'bg-red-500/20 text-red-400 border-red-500/30',
  SORTING: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  SEARCHING: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  DYNAMIC_PROGRAMMING: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  RECURSION: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  GREEDY: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  STRINGS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  MATH: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  BACKTRACKING: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
}

// Difficulty colors
const difficultyColors = {
  EASY: 'text-green-400',
  MEDIUM: 'text-yellow-400',
  HARD: 'text-red-400',
}

// Format topic name
const formatTopic = (topic: string) => {
  return topic.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

// Generate heat map data
const generateHeatMapData = () => {
  const data = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0
    data.push({ date, count })
  }
  return data
}

export default function CodeMasterPro() {
  // State
  const [currentView, setCurrentView] = useState<'home' | 'problems' | 'problem' | 'dashboard' | 'companies' | 'company'>('home')
  const [user, setUser] = useState<User | null>(null)
  const [problems, setProblems] = useState<Problem[]>([])
  const [totalProblems, setTotalProblems] = useState(0)
  const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0 })
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [companyFilter, setCompanyFilter] = useState<string>('all')
  
  // Code editor
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [dailyChallenge, setDailyChallenge] = useState<Problem | null>(null)
  const [pastSubmissions, setPastSubmissions] = useState<Submission[]>([])
  
  // Auth
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  
  // Heat map
  const [heatMapData] = useState(generateHeatMapData)

  // User submissions
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([])
  const [solvedProblems, setSolvedProblems] = useState<Problem[]>([])

  // Fetch user
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }, [])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }, [])

  // Fetch user submissions
  const fetchUserSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/submissions/user')
      if (res.ok) {
        const data = await res.json()
        setUserSubmissions(data.submissions || [])
        setSolvedProblems(data.solvedProblems?.map((s: any) => s.problem) || [])
      }
    } catch (error) {
      console.error('Failed to fetch user submissions:', error)
    }
  }, [])

  // Fetch problems
  const fetchProblems = useCallback(async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (difficultyFilter !== 'all') params.set('difficulty', difficultyFilter)
      if (topicFilter !== 'all') params.set('topic', topicFilter)
      if (companyFilter !== 'all') params.set('company', companyFilter)
      if (searchQuery) params.set('search', searchQuery)
      
      const res = await fetch(`/api/problems?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProblems(data.problems)
        setTotalProblems(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error)
    } finally {
      setIsLoading(false)
    }
  }, [difficultyFilter, topicFilter, companyFilter, searchQuery])

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch('/api/companies')
      if (res.ok) {
        const data = await res.json()
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }, [])

  // Fetch daily challenge
  const fetchDailyChallenge = useCallback(async () => {
    try {
      const res = await fetch('/api/daily-challenge')
      if (res.ok) {
        const data = await res.json()
        setDailyChallenge(data.problem)
      }
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error)
    }
  }, [])

  // Fetch problem details
  const fetchProblemDetails = useCallback(async (slug: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/problems/${slug}`)
      if (res.ok) {
        const data = await res.json()
        if (data.problem) {
          setSelectedProblem(data.problem)
          // starterCode is already parsed to object in API, use it directly
          const starterCode = data.problem.starterCode || {}
          setCode(starterCode[language] || '')
          
          // Fetch past submissions for this problem
          if (user) {
            try {
              const historyRes = await fetch(`/api/submissions/${data.problem.id}/history`)
              if (historyRes.ok) {
                const historyData = await historyRes.json()
                setPastSubmissions(historyData.submissions || [])
              }
            } catch (historyError) {
              console.error('Failed to fetch submission history:', historyError)
            }
          }
        } else {
          console.error('Problem not found in response')
        }
      }
    } catch (error) {
      console.error('Failed to fetch problem:', error)
    } finally {
      setIsLoading(false)
    }
  }, [language, user])

  // Fetch company details
  const fetchCompanyDetails = useCallback(async (slug: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/companies/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedCompany(data.company)
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch submissions
  const fetchSubmissions = useCallback(async (problemId: string) => {
    try {
      const res = await fetch(`/api/submissions/${problemId}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    }
  }, [])

  // Run code
  const runCode = async () => {
    if (!selectedProblem) return
    setIsRunning(true)
    try {
      const res = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          code,
          language,
        }),
      })
      const data = await res.json()
      setRunResult(data)
    } catch (error) {
      console.error('Failed to run code:', error)
    } finally {
      setIsRunning(false)
    }
  }

  // Submit code
  const submitCode = async () => {
    if (!selectedProblem || !user) {
      toast({ title: 'Please login to submit', variant: 'destructive' })
      return
    }
    setIsRunning(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          code,
          language,
        }),
      })
      const data = await res.json()
      toast({
        title: data.status === 'ACCEPTED' ? 'Accepted!' : 'Wrong Answer',
        description: data.status === 'ACCEPTED' ? 'Your solution passed all test cases!' : 'Check your solution and try again.',
        variant: data.status === 'ACCEPTED' ? 'default' : 'destructive',
      })
      if (data.status === 'ACCEPTED') {
        fetchUser()
      }
    } catch (error) {
      console.error('Failed to submit:', error)
    } finally {
      setIsRunning(false)
    }
  }

  // Auth handlers
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        setAuthDialogOpen(false)
        toast({ title: 'Welcome back!', description: `Logged in as ${data.user.username}` })
      } else {
        toast({ title: 'Login failed', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to login', variant: 'destructive' })
    }
  }

  const handleRegister = async () => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        setAuthDialogOpen(false)
        toast({ title: 'Welcome!', description: `Account created for ${data.user.username}` })
      } else {
        toast({ title: 'Registration failed', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to register', variant: 'destructive' })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      toast({ title: 'Logged out', description: 'See you next time!' })
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  // Effects
  useEffect(() => {
    fetchUser()
    fetchCompanies()
    fetchProblems() // Fetch problems on initial load for home page stats and daily challenge
    fetchStats() // Fetch accurate stats
    fetchDailyChallenge() // Fetch daily challenge
  }, [fetchUser, fetchCompanies, fetchProblems, fetchStats, fetchDailyChallenge])

  // Fetch submissions when user logs in
  useEffect(() => {
    if (user) {
      fetchUserSubmissions()
    }
  }, [user, fetchUserSubmissions])

  useEffect(() => {
    if (selectedProblem) {
      // starterCode is already an object (parsed in API or from problem list)
      const starterCode = typeof selectedProblem.starterCode === 'string' 
        ? JSON.parse(selectedProblem.starterCode || '{}') 
        : (selectedProblem.starterCode || {})
      setCode(starterCode[language] || '')
    }
  }, [language, selectedProblem])

  // Navigate to problem
  const navigateToProblem = (problem: Problem) => {
    setSelectedProblem(problem)
    setCurrentView('problem')
    setRunResult(null)
    fetchProblemDetails(problem.slug)
    fetchSubmissions(problem.id)
  }

  // Navigate to company
  const navigateToCompany = (company: Company) => {
    setSelectedCompany(company)
    setCurrentView('company')
    fetchCompanyDetails(company.slug)
  }

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-[#0a0a0f]' : 'bg-gray-50'}`}>
        <Toaster />
        {/* Navigation */}
        <nav className={`sticky top-0 z-50 border-b ${darkMode ? 'bg-[#0a0a0f]/95 border-gray-800 backdrop-blur' : 'bg-white/95 border-gray-200 backdrop-blur'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  CodeMaster<span className="text-green-400">Pro</span>
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {[
                  { id: 'home', label: 'Home', icon: Target },
                  { id: 'problems', label: 'Problems', icon: Brain },
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'companies', label: 'Companies', icon: Building2 },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setCurrentView(item.id as any)}
                    className={`${currentView === item.id ? 'bg-green-500/10 text-green-400' : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className={darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                {user ? (
                  <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400">
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">{user.streakCount}</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className={`gap-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="hidden sm:inline">{user.username}</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                        <DialogHeader>
                          <DialogTitle className={darkMode ? 'text-white' : ''}>Profile</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : ''}`}>{user.username}</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                            </div>
                          </div>
                          <Separator className={darkMode ? 'bg-gray-800' : ''} />
                          <div className="grid grid-cols-2 gap-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Problems Solved</p>
                              <p className={`text-2xl font-bold text-green-400`}>{user.totalSolved}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
                              <p className={`text-2xl font-bold text-orange-400`}>{user.streakCount} days</p>
                            </div>
                          </div>
                          <Button onClick={handleLogout} variant="destructive" className="w-full">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                      <DialogHeader>
                        <DialogTitle className={darkMode ? 'text-white' : ''}>
                          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </DialogTitle>
                        <DialogDescription>
                          {authMode === 'login' ? 'Sign in to track your progress' : 'Join CodeMaster Pro today'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {authMode === 'register' && (
                          <div>
                            <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
                            <Input
                              value={authForm.username}
                              onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                              placeholder="johndoe"
                              className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
                            />
                          </div>
                        )}
                        <div>
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                          <Input
                            type="email"
                            value={authForm.email}
                            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                            placeholder="you@example.com"
                            className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
                          />
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                          <Input
                            type="password"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                            placeholder="••••••••"
                            className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}
                          />
                        </div>
                        <Button
                          onClick={authMode === 'login' ? handleLogin : handleRegister}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          {authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>
                        <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                          <button
                            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                            className="text-green-400 hover:underline"
                          >
                            {authMode === 'login' ? 'Sign up' : 'Sign in'}
                          </button>
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {sidebarOpen && (
            <div className={`md:hidden border-t ${darkMode ? 'border-gray-800 bg-[#0a0a0f]' : 'border-gray-200 bg-white'}`}>
              <div className="px-4 py-3 space-y-1">
                {[
                  { id: 'home', label: 'Home', icon: Target },
                  { id: 'problems', label: 'Problems', icon: Brain },
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'companies', label: 'Companies', icon: Building2 },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => { setCurrentView(item.id as any); setSidebarOpen(false); }}
                    className={`w-full justify-start ${currentView === item.id ? 'bg-green-500/10 text-green-400' : darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <div className="space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Master Coding Interviews
                </div>
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Level Up Your
                  <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"> Coding Skills</span>
                </h1>
                <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Practice coding problems, track your progress, and prepare for technical interviews at top tech companies.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => setCurrentView('problems')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    Start Practicing
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setCurrentView('companies')}
                    className={darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : ''}
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Company Prep
                  </Button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Problems', value: stats.total, icon: Brain, color: 'text-blue-400' },
                  { label: 'Easy', value: stats.easy, icon: CheckCircle, color: 'text-green-400' },
                  { label: 'Medium', value: stats.medium, icon: Target, color: 'text-yellow-400' },
                  { label: 'Hard', value: stats.hard, icon: Trophy, color: 'text-red-400' },
                ].map((stat, i) => (
                  <Card key={i} className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Code2,
                    title: 'Interactive Code Editor',
                    description: 'Write and run code in multiple languages with our Monaco-powered editor. Get instant feedback on your solutions.',
                    color: 'from-blue-500 to-cyan-500',
                  },
                  {
                    icon: Trophy,
                    title: 'Track Your Progress',
                    description: 'Monitor your streak, view solved problems, and visualize your coding activity with detailed analytics.',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    icon: Building2,
                    title: 'Company-Specific Prep',
                    description: 'Focus on problems frequently asked by top companies like Google, Amazon, Microsoft, and more.',
                    color: 'from-purple-500 to-pink-500',
                  },
                ].map((feature, i) => (
                  <Card key={i} className={`relative overflow-hidden ${darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}`}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className={darkMode ? 'text-white' : ''}>{feature.title}</CardTitle>
                      <CardDescription className={darkMode ? 'text-gray-400' : ''}>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Daily Challenge */}
              <Card className={darkMode ? 'bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4e] border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white'}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Daily Challenge</span>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {dailyChallenge?.title || 'Loading...'}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm font-medium ${difficultyColors[dailyChallenge?.difficulty || 'EASY']}`}>
                          {dailyChallenge?.difficulty || 'EASY'}
                        </span>
                        <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {dailyChallenge ? formatTopic(dailyChallenge.topic) : ''}
                        </span>
                      </div>
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Solve today's challenge to maintain your streak!
                      </p>
                    </div>
                    <Button
                      onClick={() => dailyChallenge && navigateToProblem(dailyChallenge)}
                      disabled={!dailyChallenge}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Start Challenge
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Companies Preview */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Top Companies</h2>
                  <Button variant="ghost" onClick={() => setCurrentView('companies')} className="text-green-400 hover:text-green-300">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {companies.slice(0, 4).map((company) => (
                    <Card
                      key={company.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${darkMode ? 'bg-[#1a1a2e] border-gray-800 hover:border-green-500/50' : 'hover:border-green-500/50'}`}
                      onClick={() => navigateToCompany(company)}
                    >
                      <CardContent className="pt-6 text-center">
                        <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <Building2 className="w-8 h-8 text-green-400" />
                        </div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{company.name}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{company.problemCount || company.problems?.length || 0} problems</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROBLEMS VIEW */}
          {currentView === 'problems' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Problems</h1>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{problems.length} problems available</p>
                </div>
              </div>

              {/* Filters */}
              <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <Input
                        placeholder="Search problems..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                      />
                    </div>
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                      <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-[#1a1a2e] border-gray-700' : ''}>
                        <SelectItem value="all">All Difficulties</SelectItem>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                      <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                        <SelectValue placeholder="Topic" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-[#1a1a2e] border-gray-700' : ''}>
                        <SelectItem value="all">All Topics</SelectItem>
                        <SelectItem value="ARRAYS">Arrays</SelectItem>
                        <SelectItem value="STRINGS">Strings</SelectItem>
                        <SelectItem value="LINKED_LISTS">Linked Lists</SelectItem>
                        <SelectItem value="TREES">Trees</SelectItem>
                        <SelectItem value="GRAPHS">Graphs</SelectItem>
                        <SelectItem value="STACKS">Stacks</SelectItem>
                        <SelectItem value="QUEUES">Queues</SelectItem>
                        <SelectItem value="HEAPS">Heaps</SelectItem>
                        <SelectItem value="HASH_TABLES">Hash Tables</SelectItem>
                        <SelectItem value="SORTING">Sorting</SelectItem>
                        <SelectItem value="SEARCHING">Searching</SelectItem>
                        <SelectItem value="DYNAMIC_PROGRAMMING">Dynamic Programming</SelectItem>
                        <SelectItem value="RECURSION">Recursion</SelectItem>
                        <SelectItem value="GREEDY">Greedy</SelectItem>
                        <SelectItem value="MATH">Math</SelectItem>
                        <SelectItem value="BACKTRACKING">Backtracking</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={companyFilter} onValueChange={setCompanyFilter}>
                      <SelectTrigger className={darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}>
                        <SelectValue placeholder="Company" />
                      </SelectTrigger>
                      <SelectContent className={darkMode ? 'bg-[#1a1a2e] border-gray-700' : ''}>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.slug}>{company.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Problems List */}
              <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Title</th>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Difficulty</th>
                        <th className={`text-left p-4 font-medium hidden md:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Topic</th>
                        <th className={`text-left p-4 font-medium hidden lg:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Acceptance</th>
                        <th className={`text-left p-4 font-medium hidden lg:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Companies</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Loading...
                          </td>
                        </tr>
                      ) : problems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={`text-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No problems found
                          </td>
                        </tr>
                      ) : (
                        problems.map((problem, index) => (
                          <tr
                            key={problem.id}
                            onClick={() => navigateToProblem(problem)}
                            className={`border-b cursor-pointer transition-colors ${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'}`}
                          >
                            <td className="p-4">
                              {user && Math.random() > 0.5 ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <div className="w-5 h-5" />
                              )}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className={`${darkMode ? 'text-white' : 'text-gray-900'} hover:text-green-400`}>
                                  {index + 1}. {problem.title}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`font-medium ${difficultyColors[problem.difficulty]}`}>
                                {problem.difficulty.charAt(0) + problem.difficulty.slice(1).toLowerCase()}
                              </span>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <Badge variant="outline" className={topicColors[problem.topic] || ''}>
                                {formatTopic(problem.topic)}
                              </Badge>
                            </td>
                            <td className={`p-4 hidden lg:table-cell ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {problem.acceptance.toFixed(1)}%
                            </td>
                            <td className="p-4 hidden lg:table-cell">
                              <div className="flex items-center gap-1">
                                {problem.companies?.slice(0, 2).map((c, i) => (
                                  <Badge key={i} variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-800 text-gray-300' : ''}`}>
                                    {c.name}
                                  </Badge>
                                ))}
                                {problem.companies?.length > 2 && (
                                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    +{problem.companies.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* PROBLEM DETAIL VIEW */}
          {currentView === 'problem' && selectedProblem && (
            <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
              {/* Problem Description */}
              <div className={`lg:w-1/2 flex flex-col rounded-lg border ${darkMode ? 'bg-[#1a1a2e] border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentView('problems')}
                      className={darkMode ? 'text-gray-400 hover:text-white' : ''}
                    >
                      <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                      Back
                    </Button>
                    <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedProblem.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${difficultyColors[selectedProblem.difficulty]} bg-transparent border-current`}>
                      {selectedProblem.difficulty}
                    </Badge>
                    <Badge variant="outline" className={topicColors[selectedProblem.topic] || ''}>
                      {formatTopic(selectedProblem.topic)}
                    </Badge>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <Tabs defaultValue="description">
                    <TabsList className={`mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="solutions">Solutions</TabsTrigger>
                      <TabsTrigger value="submissions">Submissions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="space-y-4">
                      <div className={`prose prose-invert max-w-none ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p className="whitespace-pre-wrap">{selectedProblem.description}</p>
                      </div>
                      
                      {/* Examples */}
                      {selectedProblem.examples && (
                        <div className="space-y-4">
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Examples:</h4>
                          {(typeof selectedProblem.examples === 'string' ? JSON.parse(selectedProblem.examples) : selectedProblem.examples).map((example: any, i: number) => (
                            <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Example {i + 1}:</p>
                              <div className="space-y-2 text-sm">
                                <p><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Input:</span> <code className={darkMode ? 'text-green-400' : 'text-green-600'}>{example.input}</code></p>
                                <p><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Output:</span> <code className={darkMode ? 'text-blue-400' : 'text-blue-600'}>{example.output}</code></p>
                                {example.explanation && (
                                  <p><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Explanation:</span> {example.explanation}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Constraints */}
                      {selectedProblem.constraints && (
                        <div className="space-y-2">
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Constraints:</h4>
                          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <p className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedProblem.constraints}</p>
                          </div>
                        </div>
                      )}

                      {/* Hints */}
                      {selectedProblem.hints && (
                        <div className="space-y-2">
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hints:</h4>
                          {(typeof selectedProblem.hints === 'string' ? JSON.parse(selectedProblem.hints) : selectedProblem.hints).map((hint: string, i: number) => (
                            <details key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <summary className={`cursor-pointer text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Hint {i + 1}
                              </summary>
                              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{hint}</p>
                            </details>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="solutions">
                      <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                        <p>Solutions will be available after you solve the problem!</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="submissions" className="space-y-2">
                      {submissions.length === 0 ? (
                        <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                          <p>No submissions yet. Start coding!</p>
                        </div>
                      ) : (
                        submissions.map((sub) => (
                          <div key={sub.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <div className="flex items-center gap-3">
                              {sub.status === 'ACCEPTED' ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                              <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sub.language}</p>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {new Date(sub.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm ${sub.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>{sub.status}</p>
                              {sub.runtime && <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{sub.runtime}ms</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
              </div>

              {/* Code Editor */}
              <div className={`lg:w-1/2 flex flex-col rounded-lg border ${darkMode ? 'bg-[#1a1a2e] border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className={`w-40 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className={darkMode ? 'bg-[#1a1a2e] border-gray-700' : ''}>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      const starterCode = typeof selectedProblem.starterCode === 'string' 
                        ? JSON.parse(selectedProblem.starterCode || '{}') 
                        : (selectedProblem.starterCode || {})
                      setCode(starterCode[language] || '')
                    }} className={darkMode ? 'border-gray-700 text-gray-300' : ''}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <Editor
                    height="100%"
                    language={language === 'cpp' ? 'cpp' : language}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme={darkMode ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16 },
                    }}
                  />
                </div>
                
                {/* Test Results */}
                {runResult && (
                  <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {runResult.summary.allPassed ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {runResult.summary.passed}/{runResult.summary.total} Test Cases Passed
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {runResult.results.map((result, i) => (
                        <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                              Case {result.testCase}: {result.passed ? 'Passed' : 'Failed'}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{result.executionTime}ms</span>
                          </div>
                          {!result.passed && (
                            <div className="text-xs space-y-1">
                              <p><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Input:</span> {result.input}</p>
                              <p><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Expected:</span> {result.expectedOutput}</p>
                              <p><span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Actual:</span> {result.actualOutput}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`flex items-center justify-end gap-3 p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <Button variant="outline" onClick={runCode} disabled={isRunning} className={darkMode ? 'border-gray-700 text-gray-300' : ''}>
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                  <Button onClick={submitCode} disabled={isRunning} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD VIEW */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>

              {!user ? (
                <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                  <CardContent className="pt-6 text-center">
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Please login to view your dashboard</p>
                    <Button onClick={() => setAuthDialogOpen(true)} className="bg-gradient-to-r from-green-500 to-emerald-600">
                      Sign In
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Problems Solved', value: user.totalSolved, icon: CheckCircle, color: 'text-green-400' },
                      { label: 'Current Streak', value: `${user.streakCount} days`, icon: Flame, color: 'text-orange-400' },
                      { label: 'Total Problems', value: stats.total, icon: Brain, color: 'text-blue-400' },
                      { label: 'Completion', value: `${((user.totalSolved / stats.total) * 100).toFixed(1)}%`, icon: Target, color: 'text-purple-400' },
                    ].map((stat, i) => (
                      <Card key={i} className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                              <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div>
                              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Progress by Difficulty */}
                  <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                    <CardHeader>
                      <CardTitle className={darkMode ? 'text-white' : ''}>Progress by Difficulty</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { label: 'Easy', value: Math.min(user.totalSolved * 0.5, stats.easy), total: stats.easy, color: 'bg-green-500' },
                        { label: 'Medium', value: Math.min(user.totalSolved * 0.3, stats.medium), total: stats.medium, color: 'bg-yellow-500' },
                        { label: 'Hard', value: Math.min(user.totalSolved * 0.2, stats.hard), total: stats.hard, color: 'bg-red-500' },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{item.label}</span>
                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {Math.round(item.value)}/{item.total}
                            </span>
                          </div>
                          <Progress value={(item.value / item.total) * 100} className="h-2" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Heat Map */}
                  <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                    <CardHeader>
                      <CardTitle className={darkMode ? 'text-white' : ''}>Activity Heat Map</CardTitle>
                      <CardDescription>Your coding activity over the last year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {heatMapData.map((day, i) => {
                          const colors = [
                            'bg-gray-800',
                            'bg-green-900',
                            'bg-green-700',
                            'bg-green-500',
                            'bg-green-400',
                          ]
                          return (
                            <Tooltip key={i}>
                              <TooltipTrigger asChild>
                                <div
                                  className={`w-3 h-3 rounded-sm ${colors[day.count]}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{day.date.toLocaleDateString()}</p>
                                <p>{day.count} problems</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Less</span>
                        {colors.map((color, i) => (
                          <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
                        ))}
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>More</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Solved Problems */}
                  <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                    <CardHeader>
                      <CardTitle className={darkMode ? 'text-white' : ''}>Solved Problems ({solvedProblems.length})</CardTitle>
                      <CardDescription>Problems you have successfully solved</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {solvedProblems.length === 0 ? (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No problems solved yet. Start practicing!</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {solvedProblems.slice(0, 10).map((problem) => (
                            <div
                              key={problem.id}
                              onClick={() => navigateToProblem(problem)}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                              <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <div>
                                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{problem.title}</p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{formatTopic(problem.topic)}</p>
                                </div>
                              </div>
                              <span className={`text-sm font-medium ${difficultyColors[problem.difficulty]}`}>
                                {problem.difficulty}
                              </span>
                            </div>
                          ))}
                          {solvedProblems.length > 10 && (
                            <p className={`text-center text-sm pt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{solvedProblems.length - 10} more solved
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Submissions */}
                  <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                    <CardHeader>
                      <CardTitle className={darkMode ? 'text-white' : ''}>Recent Submissions</CardTitle>
                      <CardDescription>Your latest coding activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userSubmissions.length === 0 ? (
                        <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Code2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No submissions yet. Start coding!</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {userSubmissions.slice(0, 10).map((sub) => (
                            <div
                              key={sub.id}
                              className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                            >
                              <div className="flex items-center gap-3">
                                {sub.status === 'ACCEPTED' ? (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-400" />
                                )}
                                <div>
                                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {(sub as any).problem?.title || 'Unknown Problem'}
                                  </p>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {sub.language} • {new Date(sub.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-medium ${sub.status === 'ACCEPTED' ? 'text-green-400' : 'text-red-400'}`}>
                                  {sub.status}
                                </p>
                                {sub.runtime && (
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{sub.runtime}ms</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* COMPANIES VIEW */}
          {currentView === 'companies' && (
            <div className="space-y-6">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Companies</h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Practice problems asked by top tech companies</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${darkMode ? 'bg-[#1a1a2e] border-gray-800 hover:border-green-500/50' : 'hover:border-green-500/50'}`}
                    onClick={() => navigateToCompany(company)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          <Building2 className="w-7 h-7 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{company.name}</h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {company.problemCount || company.problems?.length || 0} problems
                          </p>
                        </div>
                        <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* COMPANY DETAIL VIEW */}
          {currentView === 'company' && selectedCompany && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('companies')}
                  className={darkMode ? 'text-gray-400 hover:text-white' : ''}
                >
                  <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                  Back
                </Button>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Building2 className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCompany.name}</h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedCompany.problemCount || selectedCompany.problems?.length || 0} problems
                    </p>
                  </div>
                </div>
              </div>

              <Card className={darkMode ? 'bg-[#1a1a2e] border-gray-800' : ''}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>#</th>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Title</th>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Difficulty</th>
                        <th className={`text-left p-4 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCompany.problems?.map((item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            // Navigate to problem - need to create a Problem object from CompanyProblem
                            const problem: Problem = {
                              id: item.id,
                              title: item.title,
                              slug: item.slug,
                              difficulty: item.difficulty,
                              topic: item.topic,
                              acceptance: item.acceptance,
                              frequency: item.frequency,
                              companies: [],
                            }
                            navigateToProblem(problem)
                          }}
                          className={`border-b cursor-pointer transition-colors ${darkMode ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-100 hover:bg-gray-50'}`}
                        >
                          <td className={`p-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{index + 1}</td>
                          <td className={`p-4 ${darkMode ? 'text-white' : 'text-gray-900'} hover:text-green-400`}>
                            {item.title}
                          </td>
                          <td className="p-4">
                            <span className={`font-medium ${difficultyColors[item.difficulty]}`}>
                              {item.difficulty.charAt(0) + item.difficulty.slice(1).toLowerCase()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-20 h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                                  style={{ width: `${item.frequency}%` }}
                                />
                              </div>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.frequency}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`border-t ${darkMode ? 'border-gray-800 bg-[#0a0a0f]' : 'border-gray-200 bg-gray-50'} mt-12`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  CodeMaster<span className="text-green-400">Pro</span>
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                &copy; {new Date().getFullYear()} CodeMaster Pro. Master coding interviews.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

// Colors array for heat map legend
const colors = ['bg-gray-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-400']
