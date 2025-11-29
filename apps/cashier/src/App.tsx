import { Routes, Route } from 'react-router-dom'
import { MainLayout } from './components/layouts/main-layout' 
import { HomePage } from './pages/home' 
import { AboutPage } from './pages/about' 
import { CashierPage } from './pages/cashier' 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="cashier" element={<CashierPage />} />
      </Route>
    </Routes>
  )
}