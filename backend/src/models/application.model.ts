import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      index: true,
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    panchayat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Birth Certificate",
        "Death Certificate",
        "Residence Certificate",
        "Income Certificate",
        "Caste Certificate",
        "Water Connection",
        "Complaint",
        "Other",
      ],
    },
    applicantDetails: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    documents: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
      },
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "More Information Required",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
      index: true,
    },
    remarks: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    submitedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const applicationModel = mongoose.model("Application", applicationSchema);

export default applicationModel;
