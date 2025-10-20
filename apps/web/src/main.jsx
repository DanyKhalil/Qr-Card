import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx';
import RegistrationForm from './Registration.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login></Login>
  </StrictMode>
);

