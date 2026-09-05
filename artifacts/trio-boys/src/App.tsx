import { QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClientInstance } from '@/lib/query-client';
import { JellyProvider } from '@/lib/JellyContext';
import JellyMode from '@/components/JellyMode';
import JellyScreen from '@/components/JellyScreen';
import Home from '@/pages/Home';
import ProjectSummer from '@/pages/ProjectSummer';
import Timeline from '@/pages/Timeline';
import PageNotFound from '@/lib/PageNotFound';
import ScrollToTop from '@/components/ScrollToTop';
import AdminPage from '@/pages/AdminPage';

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={{
        theme: shadcn,
        cssLayerName: 'clerk',
        options: { logoPlacement: 'inside', logoLinkUrl: basePath || '/', logoImageUrl: `${window.location.origin}${basePath}/logo.svg` },
        variables: {
          colorPrimary: '#00f5ff',
          colorForeground: '#f7f7f2',
          colorMutedForeground: '#8a8f9b',
          colorBackground: '#0d1016',
          colorInput: '#121720',
          colorInputForeground: '#f7f7f2',
          colorNeutral: '#2b313d',
          colorDanger: '#ff6b6b',
          fontFamily: 'Space Grotesk',
          borderRadius: '0.25rem',
        },
      }}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
    >
      <QueryClientProvider client={queryClientInstance}>
        <JellyProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project-summer" element={<ProjectSummer />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/sign-in/*" element={<div className="flex min-h-screen items-center justify-center bg-background px-4"><SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} /></div>} />
              <Route path="/sign-up/*" element={<div className="flex min-h-screen items-center justify-center bg-background px-4"><SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} /></div>} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
          <JellyMode />
          <JellyScreen />
          <Toaster />
        </JellyProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
