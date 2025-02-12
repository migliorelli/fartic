import { RouterProvider } from "react-router-dom";
import UsernameProvider from "./contexts/UsernameContext";
import router from "./router/router";

const App = () => {
  // const handleLoginSuccess = (id: number) => {
  //   setUserId(id);
  //   socket.auth = { userId };
  //   socket.connect();
  //   socket.emit("login", id);
  // };

  return (
    <UsernameProvider>
      <RouterProvider router={router} />
    </UsernameProvider>
  );
};

export default App;
