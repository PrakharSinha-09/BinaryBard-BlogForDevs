import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy,Suspense } from "react"
import { Spinner } from './components/Spinner'

const Signin=lazy(()=> import('./pages/Signin'))
const Signup=lazy(()=> import('./pages/Signup'))
const Blog=lazy(()=> import('./pages/Blog'))
const Blogs=lazy(()=> import('./pages/Blogs'))
const MyBlogs=lazy(()=> import('./pages/MyBlogs'))
const UpdateBlog=lazy(()=> import('./pages/UpdateBlog'))
const Publish=lazy(()=> import('./pages/Publish'))
const Profile=lazy(()=> import('./pages/Profile'))

function App() {

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Spinner />} >
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
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App