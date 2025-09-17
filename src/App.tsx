import "./App.css";
import { Outlet } from "react-router";
import { Analytics } from "@vercel/analytics/react";
function App() {
  return (
    <div>
      <Outlet />
      <Analytics />
    </div>
  );
}

export default App;
