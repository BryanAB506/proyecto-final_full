import React from 'react'
import Payment from '../components/Pago'
import CustomNavbar from '../components/Navbar'
import FooterPage from '../components/FooterPage'


export default function PaymentPage() {
    return (
        <div>
            <CustomNavbar />
            <Payment />
            <FooterPage />
        </div>
    )
}