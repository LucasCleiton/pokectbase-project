import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import ChatApp from './chatApp'; // Importe o ChatApp corretamente

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(''); // Armazenar o perfil do usuário

  const handleSuccess = (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential); // Decodificando o token JWT
    const profile = {
      email: decodedToken.email, // Obtendo o email diretamente do token decodificado
      name: decodedToken.name // Obtendo o nome diretamente do token decodificado
    };
    setUser(profile);

    // Verifica o domínio do email e define o perfil
    if (profile.email.endsWith('@discente.ifpe.edu.br')) {
      setProfile('admin');
    } else {
      setProfile('user');
    }
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="1093335024461-lt8hkrqjrdn86qucm0po8r6p2bc0lbsq.apps.googleusercontent.com">
      <div style={{ padding: 20 }}>
        {!user ? (
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        ) : (
          <>
            <h2>Bem-vindo, {user.name}!</h2>
            {/* Passa o perfil (admin ou user) para o ChatApp */}
            <ChatApp profile={profile} />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
