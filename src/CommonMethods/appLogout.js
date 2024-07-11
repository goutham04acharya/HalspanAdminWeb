import { setUser, logout } from '../pages/auth/authSlice'; // Import your action creators
export default function appLogout (dispatch, navigate) {
    // Dispatch actions
    dispatch(setUser(''));
    dispatch(logout());

    // Navigate to a new page
    navigate('/');
}
