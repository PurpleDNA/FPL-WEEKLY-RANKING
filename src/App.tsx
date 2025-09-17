import "./App.css";
import { Outlet } from "react-router";
import { Analytics } from "@vercel/analytics/next";
function App() {
  return (
    <div>
      <Outlet />
      <Analytics />
    </div>
  );
}

export default App;
