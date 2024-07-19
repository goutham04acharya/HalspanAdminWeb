import React, { useContext, useState } from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import NavrBar from '../../Components/NavBar/NavrBar'
import GlobalContext from '../../Components/Context/GlobalContext';
import ConfirmationModal from '../../Components/Modals/ConfirmationModal/ConfirmationModal.jsx'



function QuestionnairesList() {
  const { logout } = useAuth0();
  const [isModalOpen, setModalOpen] = useState(false);
  const { setToastError, setToastSuccess } = useContext(GlobalContext);


  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const hadleCancel = () => {
    setModalOpen(false);
  }

  return (
    <>
    <div className='bg-[#F4F6FA]'>
      <NavrBar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
      <div className='py-[33px] px-[25px]'>
      </div>
    </div>
     {isModalOpen &&
      <ConfirmationModal
        text='Logout'
        subText='You will be signed out of your account.'
        button1Style='border border-[#2B333B] bg-[#2B333B]'
        Button1text='Confirm'
        Button2text='Cancel'
        src='Logout-Big'
        testIDBtn1='logout'
        testIDBtn2='cancel'
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        handleButton1={handleLogout}
        handleButton2={hadleCancel}
      />}
      </>
  )
}

export default QuestionnairesList