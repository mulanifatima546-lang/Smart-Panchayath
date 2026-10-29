import mongoose, { Schema, Types, model } from "mongoose";

export const NOTICE_CATEGORIES = [
  "General",
  "Announcement",
  "Meeting",
  "Scheme",
  "Tax",
  "Water Supply",
  "Application Update",
  "Other",
] as const;

export const NOTICE_TYPES = ["general", "application"] as const;
export const NOTICE_AUDIENCES = ["panchayat", "selected_citizens"] as const;
export const NOTICE_STATUSES = ["draft", "published", "withdrawn"] as const;

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];
export type NoticeType = (typeof NOTICE_TYPES)[number];
export type NoticeAudience = (typeof NOTICE_AUDIENCES)[number];
export type NoticeStatus = (typeof NOTICE_STATUSES)[number];

export interface INoticeAttachment {
  name?: string;
  url: string;
  mimeType?: string;
}

export interface INoticeRead {
  citizenId: Types.ObjectId;
  readAt: Date;
}

export interface INotice {
  title: string;
  description: string;
  category: NoticeCategory;
  noticeType: NoticeType;
  panchayatId: Types.ObjectId;
  audience: NoticeAudience;
  recipients: Types.ObjectId[];
  applicationId: Types.ObjectId | null;
  attachments: INoticeAttachment[];
  status: NoticeStatus;
  createdBy: Types.ObjectId;
  publishedAt: Date | null;
  expiresAt: Date | null;
  readBy: INoticeRead[];
  createdAt: Date;
  updatedAt: Date;
}

const noticeAttachmentSchema = new Schema<INoticeAttachment>(
  {
    name: { type: String, trim: true, maxlength: 255 },
    url: { type: String, trim: true, required: true },
    mimeType: { type: String, trim: true },
  },
  { _id: false },
);

const noticeReadSchema = new Schema<INoticeRead>(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false },
);

const noticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Notice description is required"],
      trim: true,
      minlength: 3,
      maxlength: 10000,
    },
    category: {
      type: String,
      enum: NOTICE_CATEGORIES,
      default: "General",
      required: true,
    },
    noticeType: {
      type: String,
      enum: NOTICE_TYPES,
      default: "general",
      required: true,
    },
    panchayatId: {
      type: Schema.Types.ObjectId,
      ref: "Panchayat",
      required: true,
      index: true,
    },
    audience: {
      type: String,
      enum: NOTICE_AUDIENCES,
      default: "panchayat",
      required: true,
    },
    recipients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Citizen",
      },
    ],
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },
    attachments: {
      type: [noticeAttachmentSchema],
      default: [],
    },
    status: {
      type: String,
      enum: NOTICE_STATUSES,
      default: "draft",
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    readBy: {
      type: [noticeReadSchema],
      default: [],
    },
  },
  { timestamps: true },
);

noticeSchema.pre("validate", function () {
  if (this.audience === "selected_citizens" && this.recipients.length === 0) {
    this.invalidate(
      "recipients",
      "At least one recipient is required for a targeted notice.",
    );
  }

  if (this.noticeType === "application" && !this.applicationId) {
    this.invalidate(
      "applicationId",
      "Application-related notices require an application ID.",
    );
  }

  if (
    this.publishedAt &&
    this.expiresAt &&
    this.expiresAt <= this.publishedAt
  ) {
    this.invalidate(
      "expiresAt",
      "Expiry date must be later than publication date.",
    );
  }
});

noticeSchema.index({ panchayatId: 1, status: 1, publishedAt: -1 });
noticeSchema.index({ recipients: 1, status: 1 });

const Notice =
  (mongoose.models.Notice as mongoose.Model<INotice>) ||
  model<INotice>("Notice", noticeSchema);

export default Notice;
