import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Blog from './pages/Blog'
import Blogs from './pages/Blogs'
import MyBlogs from './pages/MyBlogs'
import UpdateBlog from './pages/UpdateBlog'
import { Publish } from './pages/Publish';
import { Profile } from './pages/Profile';

import { motion, useScroll, useSpring } from "framer-motion";

function App() {

  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/myblogs/:id" element={<MyBlogs />} />
          <Route path="/update-blog/:id" element={<UpdateBlog />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App