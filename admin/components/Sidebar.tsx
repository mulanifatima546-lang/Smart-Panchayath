"use client";
import { links } from "@/constant/links";
import { Button, Drawer } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const Sidebar = () => {
  const router = useRouter();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        height: "100%",
        "& .MuiDrawer-paper": {
          width: 260,
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          padding: 2,
          border: "none",
        },
      }}
      open={true}
      hideBackdrop
    >
      <div className="w-full flex flex-col gap-2">
        {links.map((link, i) => (
          <Button variant="text" key={i} onClick={() => router.push(link.path)}>
            {link.name}
          </Button>
        ))}
      </div>
    </Drawer>
  );
};

export default Sidebar;
