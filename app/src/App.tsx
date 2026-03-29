import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import Home from './pages/Home'
import QuestionPage from './pages/QuestionPage'
import GeneratingRoadmap from './pages/GeneratingRoadmap'
import Roadmap from './pages/Roadmap'
import Resources from './pages/Resources'
import Community from './pages/Community'
import Profile from './pages/Profile'
import CustomRoadmap from './pages/CustomRoadmap'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/question/:questionId" element={<QuestionPage />} />
        <Route path="/generating" element={<GeneratingRoadmap />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/customroadmap" element={<CustomRoadmap />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
