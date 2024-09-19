import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import ContentManager from './MainComponents/ContentManager/ContentManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/content-manager" element={<ContentManager />} />
      </Routes>
    </Router>
  );
}

export default App;