import React, { useState } from 'react'
import NavrBar from '../NavBar/NavrBar'
import ConfirmationModal from '../Modals/ConfirmationModal/ConfirmationModal';
import { useAuth0 } from "@auth0/auth0-react";
import { Outlet } from 'react-router-dom';


function Layout() {
    const { logout } = useAuth0();
    const [isModalOpen, setModalOpen] = useState(false);

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const hadleCancel = () => {
        setModalOpen(false);
    }
    return (
        <div>
            <NavrBar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
            {isModalOpen &&
                <ConfirmationModal
                    text='Logout'
                    subText='You will be signed out of your account.'
                    button1Style='border border-[#2B333B] bg-[#2B333B]'
                    Button1text='Confirm'
                    Button2text='Cancel'
                    src='Logout-Big'
                    testIDBtn1='confirm'
                    testIDBtn2='cancel'
                    isModalOpen={isModalOpen}
                    setModalOpen={setModalOpen}
                    handleButton1={handleLogout}
                    handleButton2={hadleCancel}
                />
            }
            <div className="">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout