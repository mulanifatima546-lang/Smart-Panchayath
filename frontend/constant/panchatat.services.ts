import { createElement } from "react";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CottageIcon from "@mui/icons-material/Cottage";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export const panchayatServices = [
  {
    title: "Birth Certificate",
    caption:
      "Access the digital birth regestration process upload verified hospital discharge summaries and receive digitally signed watermarked civic certificate.",
    path: "/birth-certificate",
    icon: createElement(ChildCareIcon),
  },
  {
    title: "Death Certificate",
    caption:
      "Submit verified death registery records, attach hospital certificates or legal heir declarations, and monitor designated Panchayat clearance cycle.",
    path: "/death-certificate",
    icon: createElement(CheckBoxIcon),
  },
  {
    title: "Residence Certificate",
    caption:
      "Obtain authentic village domiciliary verification with localized Ward Member endorsements, electricity ledger proof, and automated Taluka synchronization.",
    path: "/residence-certificate",
    icon: createElement(CottageIcon),
  },
  {
    title: "Document Request",
    caption:
      "Apply for income assessment proofs, character attestations, mutation notices, and non-encumbrance declaration directly with village revenue officers.",
    path: "/document-request",
    icon: createElement(FolderSharedIcon),
  },
  {
    title: "Application Tracking",
    caption:
      "Inspect multi-level governance checkpoints using you 10-digit citizen tracking refrance. View designated case officer notes and projected timelines.",
    path: "/application-tracking",
    icon: createElement(ContentPasteSearchIcon),
  },
  {
    title: "Notice and Announcements",
    caption:
      "Review public Gram Sabha dates. welf are scheme enrollment drives, agricultural subsidy opportunities, and rural development infrastructure trenders.",
    path: "/notice",
    icon: createElement(NotificationsActiveIcon),
  },
];
