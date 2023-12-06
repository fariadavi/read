import React, { useContext } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { Container } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext'
import { Redirect } from 'react-router-dom'
import { getLocalItem, LANG_KEY } from '../utils/localStorageManager'
import AppTitle from './util/AppTitle'
import GlobalSpinner from './util/GlobalSpinner'

export default function Login() {
    const { authLoading, authenticated, handleAuthentication, handleAuthLogout } = useContext(AuthContext);    

	const handleAuthenticationFail = () => {
		handleAuthLogout();

		// TODO handle failure show error msg to user 
		console.log('login failed');
	}

    return (
        authenticated 
        ? <Redirect to="/" />
        : authLoading
            ? <GlobalSpinner />
            : <Container
            className="d-flex align-item justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="d-flex flex-column align-item justify-content-center">
                <AppTitle />
                <div className="d-flex align-item justify-content-center">
                    <GoogleLogin
                        onSuccess={handleAuthentication}
                        onError={handleAuthenticationFail}
                        locale={getLocalItem(LANG_KEY)}
                        theme="outline"
                        size="large"
                        text="signin"
                        auto_select
                    />
                </div>
            </div>
        </Container>
    )
}