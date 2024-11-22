import React from "react";
import CustomNavbar from '../components/Navbar'
import FooterPage from '../components/FooterPage'
import DarkVariantExample from "../components/CarruselPrincipal";
import Dest from "../components/Destacados";
import NewWeb from "../components/NuevaWeb";
import '../styles/home.css'
import Expect from "../components/expectation";

function Home() {
    return (
        <div>
            <CustomNavbar />
            <div><DarkVariantExample /></div><br /><br />
            <div className="contPrincipal">
                
                <div className="destacados"><h1>Algunas de nuestras creaciones</h1><br /><br />
                    <Dest /></div><br /><br /><br />
                <NewWeb /><br /><br /><br />
                <Expect />
            </div>

            <div id="footer"><FooterPage /></div>

        </div>
    )
}
export default Home