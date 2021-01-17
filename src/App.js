import React from 'react'
import { ThemeProvider } from '@material-ui/core'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import './index.css'
import { skappTheme } from './theme/Theme'
import SnRouter from './SnRouter'
function App() {
  return (
      <ThemeProvider theme={skappTheme}>
        <div className="App">
          <Navbar />
          <section className="main-content">
            <aside className="app-sidebar">
              <Sidebar />
            </aside>
            <main className="app-content">
             <SnRouter/>
            </main>
          </section>
        </div>
      </ThemeProvider>
  )
}
export default App
