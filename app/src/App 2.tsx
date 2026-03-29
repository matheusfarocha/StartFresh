import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Welcome from './pages/Welcome'
import QuestionBorough from './pages/QuestionBorough'
import QuestionTimeAway from './pages/QuestionTimeAway'
import QuestionUrgentNeed from './pages/QuestionUrgentNeed'
import GeneratingRoadmap from './pages/GeneratingRoadmap'
import Roadmap from './pages/Roadmap'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/question/borough" element={<QuestionBorough />} />
        <Route path="/question/time-away" element={<QuestionTimeAway />} />
        <Route path="/question/urgent-need" element={<QuestionUrgentNeed />} />
        <Route path="/generating" element={<GeneratingRoadmap />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
