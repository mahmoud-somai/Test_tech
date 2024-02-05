// Importations des composants nécessaires depuis react-router-dom
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";

// Importation des composants de pages
import Workspace from "./workspace/Workspace";
import Login from "./login/Login";
import Register from "./register/Register";

// varialle  pour vérifier la présence du token dans le localStorage

  const token = localStorage.getItem("token");
 


// Définition du composant principal de l'application
function App() {
  return (
    // Utilisation du composant BrowserRouter pour gérer le routage
    <BrowserRouter>
      {/* Configuration des itinéraires (routes) de l'application */}
      <Routes>
        {/* Route protégée par l'authentification */}
        <Route path="/tasks" element={token ? <Workspace /> : <Navigate to="/" />} />


        {/* Définition d'une route pour la page de connexion (Login) */}
        <Route path="/" element={<Login />} />

        {/* Définition d'une route pour la page d'inscription (Register) */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

// Exportation du composant principal de l'application
export default App;
