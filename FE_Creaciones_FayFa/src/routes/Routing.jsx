import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from '../page/Header';

export default function Routing() {

    return (
     <Router>
      <Routes>
        <Route path="/Header" element={<Header />} />
      </Routes>
    </Router>


    )
}