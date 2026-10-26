"use client";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { ReactNode, useId, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (path?: string) => {
    setAnchorEl(null);
    if (path) {
      router.push(path);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Nav />
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full h-full p-4 border-t border-l rounded-md border-gray-400">
          {children}
          <div className="absolute bottom-10 right-10">
            <IconButton onClick={handleClick} size="large">
              <AddIcon sx={{ fontSize: 60 }} className="text-blue-500" />
            </IconButton>

            <Menu
              id={menuId}
              anchorEl={anchorEl}
              open={open}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              slotProps={{
                list: {
                  "aria-labelledby": buttonId,
                },
              }}
            >
              <MenuItem onClick={() => handleClose("/new-panchayat")}>
                New Panchayat
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
