import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import FileUploader from './components/upload/FileUploader'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Customers from './pages/Customers'
import Campaigns from './pages/Campaigns'
import CampaignBuilder from './pages/CampaignBuilder'
import SmartCampaign from './pages/SmartCampaign'
import Broadcast from './pages/Broadcast'
import CampaignTemplates from './pages/CampaignTemplates'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Landing from './pages/Landing'

import { Pricing } from './pages/Pricing'
import { HowItWorks } from './pages/HowItWorks'
import { Contact } from './pages/Contact'
import { Legal } from './pages/Legal'
import { Waitlist } from './pages/Waitlist'
import { NotFound } from './pages/NotFound'
import IndustryLanding from './pages/IndustryLanding'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'

import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/waitlist" replace />
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation - Fixed 220px */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-56">
        {/* Header - Sticky */}
        <Header />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page - Root domain (servicedueapp.in) */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />

            {/* Auth Pages - PROTECTED FOR DEPLOYMENT */}
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/login" element={<Waitlist />} />
            <Route path="/signup" element={<Waitlist />} />
            <Route path="/forgot-password" element={<Waitlist />} />

            {/* Info Pages */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
            <Route path="/terms" element={<Legal title="Terms of Service" />} />

            {/* Programmatic SEO - Dynamic Solutions */}
            <Route path="/solutions/:slug" element={<IndustryLanding />} />

            {/* Dashboard App - Separate routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/app" element={<Home />} />
              <Route path="/dashboard/overview" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/create" element={<CampaignBuilder />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/smart-campaign" element={<SmartCampaign />} />
              <Route path="/broadcast" element={<Broadcast />} />
              <Route path="/templates" element={<CampaignTemplates />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="/upload"
                element={
                  <div className="animate-fadeIn">
                    <h1 className="text-xl font-semibold text-slate-800 mb-6">Upload Data</h1>
                    <FileUploader />
                  </div>
                }
              />
            </Route>

            {/* 404 Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
