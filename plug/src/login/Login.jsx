import React, { useState } from 'react';
import './Login.css';
import UserService from '../services/user.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
  // États pour stocker les valeurs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Gérer la soumission du formulaire de connexion
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Créer un objet utilisateur avec les données du formulaire
      const user = { email, password };
      
      // Appeler le service utilisateur pour effectuer la connexion
      const response = await UserService.login(user);

      
      console.log(response.data);
      // animation de connexion réussie
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500
      });

      // Extraire le token et l'ID utilisateur de la réponse
      const token = response.data.token;
      const user_id = response.data.id;

      // Stocker le token et l'ID utilisateur dans le stockage local
      localStorage.setItem('token', token);
      localStorage.setItem('id', user_id);

      // Rediriger l'utilisateur vers la page des tâches après la connexion réussie
      navigate('/tasks');



    } catch (error) {
      console.error('Échec de la connexion :', error);
      
      // animation de l'echec de  connexion 
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Invalid Credentials",
        showConfirmButton: false,
        timer: 1500
      });

    }
  };

  // Gérer le clic sur le bouton d'inscription
  const handleSignUp = () => {
    // Rediriger l'utilisateur vers la page d'inscription
    navigate('/register');
  };

  return (
    <div className="login-box">
      <p>Login</p>
      <form onSubmit={handleLogin}>
        {/* Champ de saisie pour l'e-mail */}
        <div className="user-box">
          <input
            required=""
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email</label>
        </div>
        {/* Champ de saisie pour le mot de passe */}
        <div className="user-box">
          <input
            required=""
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
        </div>
        {/* Bouton de soumission du formulaire */}
        <button type="submit" className='btn_login' onClick={handleLogin}>
          LOGIN
        </button>
      </form>
      {/* Lien pour aller à la page d'inscription */}
      <p>
        Don't have an account?{' '}
        <button className='btn_login' onClick={handleSignUp}>
          SIGN UP
        </button>
      </p>
    </div>
  );
};

export default Login;
