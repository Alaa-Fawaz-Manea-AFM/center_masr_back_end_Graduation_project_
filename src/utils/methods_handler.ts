import { Injectable } from '@nestjs/common';
import { CENTER, STUDENT, TEACHER } from './constant';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import {
  ExtraProfileDataType,
  ProfileDataType,
  UserDataType,
} from 'src/types/type';

@Injectable()
export class ProfileService {
  buildProfileData(role: string, data: UpdateUserDto) {
    const {
      bio,
      name,
      phone,
      address,
      imageUrl,
      whatsApp,
      classRoom,
      classRooms,
      sharePrice,
      studySystem,
      governorate,
      studyMaterial,
      studyMaterials,
      experienceYear,
      contactUsPhone,
      contactUsEmail,
      educationalStage,
      educationalQualification,
    } = data;

    const userData: UserDataType = {
      name,
      imageUrl,
      phone,
      address,
    };

    let extraProfileData: ExtraProfileDataType = {};
    let profileData: ProfileDataType = {};

    if (role === TEACHER) {
      profileData = {
        classRooms,
        studySystem,
        studyMaterial,
      };

      extraProfileData = {
        bio,
        whatsApp,
        sharePrice,
        experienceYear,
        educationalQualification,
      };
    }

    if (role === STUDENT) {
      profileData = {
        classRoom,
        educationalStage,
      };
    }

    if (role === CENTER) {
      profileData = {
        studySystem,
        governorate,
        educationalStage,
      };

      extraProfileData = {
        bio,
        whatsApp,
        studyMaterials,
        contactUsPhone,
        contactUsEmail,
      };
    }

    return {
      userData,
      profileData,
      extraProfileData,
    };
  }

  private removeEmptyObjects(dto: any) {
    return Object.fromEntries(
      Object.entries(dto).filter(([_, value]) => {
        if (value === undefined) return false;
        if (
          typeof value === 'object' &&
          value !== null &&
          Object.keys(value).length === 0
        ) {
          return false;
        }
        return true;
      }),
    );
  }
}
