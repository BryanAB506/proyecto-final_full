import React from "react";
import HeaderPage from "../components/HeaderPage";
import FooterPage from '../components/FooterPage'
import '../styles/home.css'

function Home() {
    return(
        <div>          
            <HeaderPage/>

            <div id="footer">
            <FooterPage/>
            </div>
        </div>
    )
}
export default Home