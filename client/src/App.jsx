import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogDetail from "./pages/BlogDetail";
import BlogForm from "./pages/BlogForm";
import Dashboard from "./pages/Dashboard";
import MyBlogs from "./pages/MyBlogs";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Categories from "./pages/Categories";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

function Shell() {
  return <>
    <Navbar />
    <main className="site-main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<Home showAll />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/blogs" element={<MyBlogs />} />
          <Route path="/dashboard/bookmarks" element={<Bookmarks />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/blogs/new" element={<BlogForm />} />
          <Route path="/blogs/:id/edit" element={<BlogForm edit />} />
        </Route>
        <Route element={<ProtectedRoute admin />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>;
}

export default function App() {
  return <BrowserRouter><AuthProvider><Shell /></AuthProvider></BrowserRouter>;
}
