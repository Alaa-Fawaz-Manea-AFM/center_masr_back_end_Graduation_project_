import { RoleEnumDto } from 'src/validators/rolesDto';

type PayloadTokenType = {
  userId: string;
  profileId: string;
  role: string;
};

type RequestType = {
  userId: string;
  role: RoleEnumDto;
  profileId?: string;
};

type UserDataType = {
  name?: string;
  imageUrl: string | undefined;
  phone?: string;
  address?: string;
};

type ProfileDataType = {
  classRoom?: string;
  classRooms?: string[];
  studySystem?: string[];
  studyMaterial?: string;
  educationalStage?: string | string[];
  governorate?: string;
};

type ExtraProfileDataType = {
  bio?: string;
  whatsApp?: string;
  sharePrice?: number;
  experienceYear?: number;
  educationalQualification?: string;
  studyMaterials?: string[];
  classRoom?: string;
  governorate?: string;
  educationalStage?: string;
  studySystem?: string[];
  studyMaterial?: string[];
  contactUsPhone?: string[];
  contactUsEmail?: string[];
};

export type {
  RequestType,
  PayloadTokenType,
  UserDataType,
  ProfileDataType,
  ExtraProfileDataType,
};
