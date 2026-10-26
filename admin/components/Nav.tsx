import { AppBar, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import icon from "@/assests/images/icon.png";

const Nav = () => {
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: "none",
        backgroundColor: "#FFF",
      }}
    >
      <Toolbar className="flex flex-row text-[#333] justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src={icon} alt="Icon" className="w-14 h-14" />
          <div>
            <Typography variant="h6">Smart Grampanchayat</Typography>
            <Typography variant="caption">Administration Portal</Typography>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
