import AppRoutes from "./assets/routes/AppRoutes";
import { AuthProvider } from "./assets/context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;