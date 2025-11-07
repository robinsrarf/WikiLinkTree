import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./Components/NavBar.jsx";
import HomePage from "./Components/HomePage.jsx";
import ForceDirectedTree from "./Components/WikiGraph.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <HomePage />
      </>
    ),
  },
  {
    path: "/WikiLinkTree",
    element: (
      <>
        <Navbar />
        <ForceDirectedTree />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
