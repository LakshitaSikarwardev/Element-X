import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Element from './Components/Element';
import Hero from './Components/Hero';
import Login from './Components/Login';
import Create from './Components/Create';
import Review from './Components/Review';
import GetCode from './Components/GetCode';
import Profile from './Components/Profile';
import ReportUser from './Components/ReportUser';
import Search from './Components/Search';
import NotFound from './Components/NotFound';
import EditProfile from './Components/EditProfile';

import './App.css';


const App = () => {
    
  return (
      <div style={{background : "#171717"}}>
        <BrowserRouter>
        <Navbar />
            <Routes>
              <Route path='/' element={<Hero />} />
              <Route path='/elements' element={<Element />} />
              <Route path='/login' element={<Login />} />
              <Route path='/create' element={<Create />} />
              <Route path='/review' element={<Review />}/>
              <Route path='/profile/:user' element={<Profile />} />
              <Route path='/getcode/:id' element={<GetCode />} />
              <Route path="/report/:id" element={<ReportUser />} />
              <Route path="/search" element={<Search />}/>
              <Route path="/edit-profile" element={<EditProfile />}/>
              <Route path='*' element={<NotFound />}/>
            </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
