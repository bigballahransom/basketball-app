import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "@/types/user";

export interface IProfileBase {
  user: IUser;
  phoneNumber: string;
  basketball?: boolean;
  pickleball?: boolean;
  golf?: boolean;
  ultimateFrisbee?: boolean;
}

export interface IProfile extends IProfileBase, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Define the document methods (for each instance of a profile)
interface IProfileMethods {
  updateProfile(data: Partial<IProfileBase>): Promise<void>;
  removeProfile(): Promise<void>;
}

// Define the static methods
interface IProfileStatics {
  getAllProfiles(): Promise<IProfileDocument[]>;
  getProfileById(profileId: string): Promise<IProfileDocument | null>;
}

// Merge the document methods, and static methods with IProfile
export interface IProfileDocument extends IProfile, IProfileMethods {}
interface IProfileModel extends IProfileStatics, Model<IProfileDocument> {}

// Define the Profile schema
const ProfileSchema = new Schema<IProfileDocument>(
  {
    user: {
      userId: { type: String, required: true },
      userImage: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    phoneNumber: { type: String, required: true },
    basketball: { type: Boolean, default: false },
    pickleball: { type: Boolean, default: false },
    golf: { type: Boolean, default: false },
    ultimateFrisbee: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Instance method to update profile
ProfileSchema.methods.updateProfile = async function (data: Partial<IProfileBase>) {
  try {
    Object.assign(this, data);
    await this.save();
  } catch (error) {
    console.error("Error updating profile", error);
  }
};

// Instance method to remove profile
ProfileSchema.methods.removeProfile = async function () {
  try {
    await this.model("Profile").deleteOne({ _id: this._id });
  } catch (error) {
    console.error("Error when removing profile", error);
  }
};

// Static method to get all profiles
ProfileSchema.statics.getAllProfiles = async function () {
  try {
    const profiles = await this.find().sort({ createdAt: -1 }).lean();
    return profiles;
  } catch (error) {
    console.error("Error when getting all profiles", error);
  }
};

// Static method to get profile by ID
ProfileSchema.statics.getProfileById = async function (profileId: string) {
  try {
    const profile = await this.findById(profileId).lean();
    return profile;
  } catch (error) {
    console.error("Error when getting profile by ID", error);
  }
};

export const Profile =
  (mongoose.models.Profile as IProfileModel) ||
  mongoose.model<IProfileDocument, IProfileModel>("Profile", ProfileSchema);
