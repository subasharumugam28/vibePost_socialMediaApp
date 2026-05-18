import './App.css';
import {BrowserRouter, Route, Routes,Outlet } from 'react-router-dom';
import Signup from './Components/SignUp';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import Post from './Components/Post'
import MyPost from './Components/MyPost';
import EditPost from './Components/EditPost';
import NavBar from './Components/NavBar';
function App() {
  function Layout(){
    return(
    <>
    <NavBar></NavBar>
    <Outlet></Outlet>
    </>)
  }
  return (
    <>
    <div className="App">
       <BrowserRouter>
       <Routes>
      <Route path="/" element={<Signup />} />

      <Route path="/signup" element={<Signup />} />
        <Route path='/login' element={<Login></Login>}>     </Route>
<Route element={<Layout/>}>
        <Route path='/homepage' element={<HomePage></HomePage>}></Route>
        <Route path='/mypost' element={<MyPost></MyPost>}></Route>
        <Route path="/Post" element={<Post></Post>}></Route>
        <Route path="/EditPost" element={<EditPost></EditPost>}></Route>
</Route>
       </Routes>
       </BrowserRouter>
    </div>
    </>
  );
}

export default App;
