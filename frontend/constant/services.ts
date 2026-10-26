import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import VerifiedIcon from "@mui/icons-material/Verified";
import SyncIcon from "@mui/icons-material/Sync";
import CampaignIcon from "@mui/icons-material/Campaign";
import { createElement } from "react";

export const services = [
  {
    title: "Online Applications",
    caption: "Apply for services from your home",
    icon: createElement(TextSnippetIcon),
  },
  {
    title: "Cerificate Serives",
    caption: "Request and Download certified",
    icon: createElement(VerifiedIcon),
  },
  {
    title: "Application Tracking",
    caption: "Check real-time stage progress",
    icon: createElement(SyncIcon),
  },
  {
    title: "Official Notices",
    caption: "Stay updated on village",
    icon: createElement(CampaignIcon),
  },
];
