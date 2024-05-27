import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./views/Login/index";
import Chat from "./views/Chat/index";
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index Component={Login} />
          <Route path="login" Component={Login} />
          <Route path="chat" Component={Chat} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
