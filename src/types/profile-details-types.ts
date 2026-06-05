export type ProfileDetails = {
  id: string;
  userId: string;
  profilePictureUrl: string | null;
  firstName: string | null;
  surname: string | null;
  lastName: string | null;
  companyName: string | null;
  phoneNumber: string | null;
};

export type ProfileDetailsFormValues = {
  firstName: string;
  surname: string;
  lastName: string;
  companyName: string;
  phoneNumber: string;
  imageFile: File | null;
};
