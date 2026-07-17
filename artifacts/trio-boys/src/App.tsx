import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { JellyProvider } from '@/lib/JellyContext';
import JellyMode from '@/components/JellyMode';
import Home from '@/pages/Home';
import ProjectSummer from '@/pages/ProjectSummer';
import PageNotFound from '@/lib/PageNotFound';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <JellyProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project-summer" element={<ProjectSummer />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <JellyMode />
        <Toaster />
      </JellyProvider>
    </QueryClientProvider>
  );
}

export default App;
