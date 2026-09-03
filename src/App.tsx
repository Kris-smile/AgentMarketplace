// 路由配置：5 个页面 + 兜底路由
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HomePage from '@/pages/HomePage'
import ExplorePage from '@/pages/ExplorePage'
import ProviderDetailPage from '@/pages/ProviderDetailPage'
import JoinPage from '@/pages/JoinPage'
import AboutPage from '@/pages/AboutPage'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* 页面主体：撑满剩余高度 */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/provider/:id" element={<ProviderDetailPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* 兜底：未知路径回主页 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
