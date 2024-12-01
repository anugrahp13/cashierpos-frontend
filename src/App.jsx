// Import React and useEffect
import React, { useEffect } from "react";

//import Toaster
import { Toaster } from "react-hot-toast";

// Import theme store
import { useStore } from "./stores/theme";

function App() {
  // destructure state "theme" from useStore
  const { theme } = useStore();

  // set document theme
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  return (
    <>
      <Toaster />
    </>
  );
}

export default App;
