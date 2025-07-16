import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter } from 'react-router-dom';
import { TopicProvider } from './context/TopicContent.jsx';
import { MentorProvider } from './context/MentorContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SocketProvider>
      <TopicProvider>
        <MentorProvider>
          <App />
        </MentorProvider>
      </TopicProvider>
    </SocketProvider>
  </BrowserRouter>,
)
