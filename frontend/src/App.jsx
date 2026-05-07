import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AllFiles from './pages/AllFiles.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/files" element={<AllFiles />} />
    </Routes>
  );
}

export default App;
