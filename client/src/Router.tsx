import { BrowserRouter, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import Nav from "./components/Nav";

const Router = () => {
  return (
    <div className="font-nunito">
      <BrowserRouter>
    <Nav />
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/register" exact component={RegisterPage} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
    </div>
  );
};

export default Router;
