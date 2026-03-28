import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const isGenerating = location.pathname === '/generating'
  const isRoadmap = location.pathname === '/roadmap'

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body">
      <Header disabled={isGenerating} />
      <Outlet />
      {!isRoadmap && <Footer />}
    </div>
  )
}
