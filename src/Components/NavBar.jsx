import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import img from "../Assests/Gemini_Generated_Image_oqrr4aoqrr4aoqrr.png";
import "../Styles/NavBar.css";
import React from "react";
function NavBar() {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <div className="homepagenavbar">

      {/* LEFT - LOGO (Instagram style) */}
      <div className="nav-left">
        <Link to="/homepage">
          <img src={img} alt="logo" loading="lazy" />
        </Link>
      </div>

      {/* CENTER - EMPTY */}
      <div className="nav-center"></div>

      {/* RIGHT - YOUR ORIGINAL LOGIC KEPT */}
      <div className="nav-right">

        <Stack spacing={2} direction="row">

          {pathName === "/post" || (
            <Link to="/post">
              <Button variant="contained">Create Post</Button>
            </Link>
          )}

          {pathName === "/mypost" || (
            <Link to="/mypost">
              <Button variant="contained">My Post</Button>
            </Link>
          )}

          <Link to="/login">
            <Button variant="contained">Logout</Button>
          </Link>

        </Stack>

      </div>

    </div>
  );
}
export default React.memo(NavBar);