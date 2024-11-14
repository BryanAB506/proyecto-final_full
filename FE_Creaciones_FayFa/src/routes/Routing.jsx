import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from '../page/Header';
import Home from '../page/Home';


export default function Routing() {

    return (
     <Router>
      <Routes>
        <Route path="/Header" element={<Header />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>


    )
}