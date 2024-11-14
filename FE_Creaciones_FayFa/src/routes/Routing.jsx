import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from '../page/Header';
import Home from '../page/Home';
import SobreNosotrosPage from '../page/SobreNosotrosP';


export default function Routing() {

    return (
     <Router>
      <Routes>
        <Route path="/Header" element={<Header />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/sobreNosotros" element={<SobreNosotrosPage/>} />
      </Routes>
    </Router>


    )
}