import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from '../page/Header';
import Home from '../page/Home';
<<<<<<< HEAD
import Contact from '../page/Contact';
=======
import SobreNosotrosPage from '../page/SobreNosotrosP';
>>>>>>> 470d2a7228f1cb07d8eeb8f15a4f875f77b6d48c


export default function Routing() {

    return (
     <Router>
      <Routes>
        <Route path="/Header" element={<Header />} />
        <Route path="/Home" element={<Home />} />
<<<<<<< HEAD
        <Route path="/Contact" element={<Contact />} />
=======
        <Route path="/sobreNosotros" element={<SobreNosotrosPage/>} />
>>>>>>> 470d2a7228f1cb07d8eeb8f15a4f875f77b6d48c
      </Routes>
    </Router>


    )
}