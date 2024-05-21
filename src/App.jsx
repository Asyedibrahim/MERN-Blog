import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Projects from './pages/Projects';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


export default function App() {
  return (
    <BrowserRouter>

    <Header/>

      <Routes>
        <Route path='/' element={<Home />}></Route>

        <Route path='/about' element={<About />}></Route>

        <Route path='/projects' element={<Projects />}></Route>

        <Route path='/dashboard' element={<Dashboard />}></Route>

        <Route path='/sign-in' element={<SignIn />}></Route>

        <Route path='/sign-up' element={<SignUp />}></Route>
        
      </Routes>

    </BrowserRouter>
  )
}