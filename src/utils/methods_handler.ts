import { Injectable } from '@nestjs/common';
import { CENTER, STUDENT, TEACHER } from './constant';
import { UpdateUserDto } from 'src/user/dto/updateUser.dto';
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

    const userData = this.removeNullish({
      name,
      imageUrl,
      phone,
      address,
    }) as UserDataType;

    let extraProfileData: ExtraProfileDataType = {};
    let profileData: ProfileDataType = {};

    if (role === TEACHER) {
      profileData = this.removeNullish({
        classRooms,
        studySystem,
        studyMaterial,
      });

      extraProfileData = this.removeNullish({
        bio,
        whatsApp,
        sharePrice,
        experienceYear,
        educationalQualification,
      });
    }

    if (role === STUDENT) {
      profileData = this.removeNullish({
        classRoom,
        educationalStage,
      });
    }

    if (role === CENTER) {
      profileData = this.removeNullish({
        studySystem,
        governorate,
        educationalStage,
      });

      extraProfileData = this.removeNullish({
        bio,
        whatsApp,
        studyMaterials,
        contactUsPhone,
        contactUsEmail,
      });
    }

    return {
      userData,
      profileData,
      extraProfileData,
    };
  }

  removeNullish<T extends Record<string, any>>(obj: T): Partial<T> {
    const cleaned: Partial<T> = {};

    for (const key in obj) {
      const value = obj[key];

      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value;
      }
    }

    return cleaned;
  }
}
