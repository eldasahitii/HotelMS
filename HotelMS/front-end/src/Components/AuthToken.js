import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import jwt_decode from 'jwt-decode';

const useAuthToken = () => {
    const [cookies] = useCookies(['access_token']);
    const [token, setToken] = useState(cookies.access_token || '');
    const [userId, setUserId] = useState('');
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = cookies.access_token;
        setToken(token || '');

        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                const exp = decodedToken.exp;
                const currentTime = Date.now() / 1000; 

                if (exp && exp < currentTime) {
                    setToken('');
                    setUserId('');
                    setUserRole(null);
                    console.log('Token has expired');
                } else {
                    const id = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
                    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
                    setUserId(id);
                    setUserRole(role);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                setToken('');
                setUserId('');
                setUserRole(null);
            }
        } else {
            setUserId('');
            setUserRole(null);
        }
    }, [cookies.access_token]);

    return { token, userId, userRole };
};

export default useAuthToken;
