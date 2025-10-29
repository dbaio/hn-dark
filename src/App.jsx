import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoryList from './pages/StoryList';
import ItemDetail from './pages/ItemDetail';
import Comments from './pages/Comments';
import Past from './pages/Past';
import About from './pages/About';
import FromSite from './pages/FromSite';
import User from './pages/User';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StoryList type="top" />} />
        <Route path="/new" element={<StoryList type="new" />} />
        <Route path="/best" element={<StoryList type="best" />} />
        <Route path="/ask" element={<StoryList type="ask" />} />
        <Route path="/show" element={<StoryList type="show" />} />
        <Route path="/jobs" element={<StoryList type="jobs" />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/past" element={<Past />} />
        <Route path="/from" element={<FromSite />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
