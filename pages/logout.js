import { useEffect } from 'react';
import {useContext} from "react";
import UserContext from "../contexts/UserContext";

const logout = () => {
    const {logOut} = useContext(UserContext);
    useEffect(() => {
        logOut();
    }, [logOut])
    return null;
};

export default logout;