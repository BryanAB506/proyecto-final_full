import React from "react";
import HeaderPage from "../components/HeaderPage";
import FooterPage from '../components/FooterPage'
import DarkVariantExample from "../components/CarruselPrincipal";
import Dest from "../components/Destacados";
import NewWeb from "../components/NuevaWeb";
import '../styles/home.css'
import Expect from "../components/expectation";

function Home() {
    return(
        <div>          
            <HeaderPage/>
            <div><DarkVariantExample/></div><br /><br />
            <div className="destacados"><h1>Productos Destacados</h1><br /><br />
            <Dest/></div><br /><br /><br />
            <NewWeb/><br /><br /><br />
            <Expect/>

            <div id="footer"><FooterPage/></div>
            
        </div>
    )
}
export default Home