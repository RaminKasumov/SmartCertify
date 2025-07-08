export interface UserModel {
    userId: number;
    displayName: string;
    firstName: string;
    lastName: string;
    email: string;
    adObjId: string;
    profileImageUrl?: string; // Optional field
    bio?: string;               // Optional field
  }
  