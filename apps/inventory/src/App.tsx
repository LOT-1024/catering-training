import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home'; 
import { MenuPage } from './pages/MenuPage'; 
import { MainLayout } from './layouts/MainLayout'; 

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </MainLayout>
  );
};