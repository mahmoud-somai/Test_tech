import React, { useState } from 'react';
import '../login/Login.css';
import UserService from '../services/user.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const Register = () => {
  // État pour stocker les données de l'utilisateur
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // Gérer les modifications des champs de saisie
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Gérer la soumission du formulaire d'inscription
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Appeler le service d'inscription avec l'objet utilisateur
      const response = await UserService.register(user);

      // Gérer la réponse ou rediriger vers une autre page si nécessaire
      console.log('Inscription réussie :', response.data);
            // animation d'inscription réussie
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Registration Successful",
              showConfirmButton: false,
              timer: 1500
            });
      navigate('/');
    } catch (error) {
      // Gérer l'échec de l'inscription
      console.error("L'inscription a échoué :", error);
      navigate('/register');
      // animation de echec d'inscription
      Swal.fire({
      position: "top-end",
      icon: "error",
      title: "Registration Failed",
      showConfirmButton: false,
      timer: 1500
      });
    }
  };

  // Gérer le clic sur le bouton pour passer à la page de connexion
  const handleSignin = () => {
    navigate('/');
  };

  return (
    <div className="login-box">
      <p>Register</p>
      <form onSubmit={handleRegister}>
        {/* Champ de saisie pour l'e-mail */}
        <div className="user-box">
          <input
            required=""
            name="email"
            type="text"
            value={user.email}
            onChange={handleInputChange}
          />
          <label>Email</label>
        </div>
        {/* Champ de saisie pour le mot de passe */}
        <div className="user-box">
          <input
            required=""
            name="password"
            type="password"
            value={user.password}
            onChange={handleInputChange}
          />
          <label>Password</label>
        </div>
        {/* Bouton de soumission du formulaire */}
        <button type="submit" className='btn_login'>
          REGISTER
        </button>
      </form>
      {/* Lien pour aller à la page de connexion */}
      <p>
        Already Have An Account{' '}
        <button className='btn_login' onClick={handleSignin}>SIGN IN</button>
      </p>
    </div>
  );
};

export default Register;
