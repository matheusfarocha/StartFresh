import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './context/AuthContext'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Home from './pages/Home'
import QuestionPage from './pages/QuestionPage'
import GeneratingRoadmap from './pages/GeneratingRoadmap'
import Roadmap from './pages/Roadmap'
import Resources from './pages/Resources'
import Community from './pages/Community'
import CommunityThread from './pages/CommunityThread'
import Profile from './pages/Profile'
import CustomRoadmap from './pages/CustomRoadmap'
import FollowUpQuestions from './pages/FollowUpQuestions'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  if (!isLoggedIn) return <Navigate to="/" replace />
  return <>{children}</>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        <Route path="/question/:questionId" element={<RequireAuth><QuestionPage /></RequireAuth>} />
        <Route path="/followup" element={<RequireAuth><FollowUpQuestions /></RequireAuth>} />
        <Route path="/generating" element={<RequireAuth><GeneratingRoadmap /></RequireAuth>} />
        <Route path="/roadmap" element={<RequireAuth><Roadmap /></RequireAuth>} />
        <Route path="/customroadmap" element={<RequireAuth><CustomRoadmap /></RequireAuth>} />
        <Route path="/resources" element={<RequireAuth><Resources /></RequireAuth>} />
        <Route path="/community" element={<RequireAuth><Community /></RequireAuth>} />
        <Route path="/community/:postId" element={<RequireAuth><CommunityThread /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </>
  )
}
