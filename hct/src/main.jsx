import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { RoleProvider } from './context/RoleContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CampusProvider } from './context/CampusContext.jsx'
import { CheckInProvider } from './context/CheckInContext.jsx'
import { ContractorProvider } from './context/ContractorContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CampusProvider>
          <RoleProvider>
            <ContractorProvider>
              <CheckInProvider>
                <App />
              </CheckInProvider>
            </ContractorProvider>
          </RoleProvider>
        </CampusProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
