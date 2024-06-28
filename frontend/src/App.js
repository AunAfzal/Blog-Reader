import { BrowserRouter as Router,Route,Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Navbar from "./components/navbar";
import AboutUsPage from "./pages/aboutUs";
import Home from "./pages/home";
import PublishBlog from "./pages/publishBlog";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import BlogDetailsPage from "./pages/blogDetails";
import NotFound from "./pages/notFound";
import MyProfile from './pages/myProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/about" component={AboutUsPage} />
          <Route path="/publish" component={PublishBlog} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/blog/:id" component={BlogDetailsPage} />
          <Route path="/myProfile/:mode" component={MyProfile} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
