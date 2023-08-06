import { BrowserRouter, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import Nav from "./components/Nav";
import CataloguePage from "./pages/CataloguePage";
import ProductComponent from "./components/ProductComponent";

const Router = () => {
  return (
    <div className="font-poppins">
      <BrowserRouter>
    <Nav />
      <Switch>
        <Route path="/" exact component={LandingPage} />
        <Route path="/login" exact component={LoginPage} />
        <Route path="/register" exact component={RegisterPage} />
        <Route path="/catalogue" exact component={CataloguePage} />
        <Route path="/catalogue/:productId" component={ProductComponent} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
    </div>
  );
};

export default Router;
