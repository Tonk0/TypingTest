import { Suspense } from 'react';
import { SettingsProvider } from './Context';
import Main from './pages/Main';
import './i18n';

function App() {
  return (
    <div className="app">
      <Suspense fallback="loading">
        <SettingsProvider>
          <Main />
        </SettingsProvider>
      </Suspense>
    </div>
  );
}

export default App;
