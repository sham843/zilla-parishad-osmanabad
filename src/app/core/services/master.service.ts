import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private apiService: ApiService) { }

  getAllState(langFlag?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllState?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllDistrict(langFlag?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllDistrict?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllTaluka(langFlag?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllTaluka?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllVillage(langFlag?: string, talukaId?: any) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllVillageByTalukaId?flag_lang=' + langFlag + '&TalukaId=' + talukaId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllCenter(langFlag?: string, talukaId?: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllCenterByTalukaId?flag_lang=' + langFlag+'&TalukaId='+talukaId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSchoolType(langFlag?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSchoolType?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSubject(langFlag?: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSubject?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  GetAllSubjectsByGroupClassId(langFlag?: string, groupId?:any) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSubjectsByGroupClassId?flag_lang=' + langFlag+'&GroupClassId='+ groupId , false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }
  getAllStandard(groupId:number,langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllStandard?GroupId='+groupId+'&flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllGroupClass(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllGroupClass?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllGender(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllGender?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllReligion(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllReligion?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSpecialization(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSpecialization?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllCaste(langFlag: string, religionId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllCaste?flag_lang='+langFlag+'&ReligionId='+religionId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getRoleOfTeacher(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetRoleOfTeacher?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllUserType(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllUserType?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSubUserTypeById(id: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSubUserByUserTypeId?UserTypeId=' + id, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }


  GetAllDesignationLevel(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllDesignationLevel?flag_lang='+ langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => {
          if (res.statusCode == "200") {
            // console.log("res", res);
            obj.next(res)
          } else { obj.error(res); }
        },
        error: (e: any) => { obj.error(e) }
      });
    });
  }


  GetDesignationByLevelId(langFlag: string, desigLevelId: number) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetDesignationByLevelId?DesignationLevelId='+desigLevelId+'&flag_lang= '+langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  GetSchoolCategoryDescById(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetSchoolCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  GetSchoolMngDescById(langFlag: string) {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetSchoolMngDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getUniversityCategoryDescById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetUniversityCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getTwelveBranchCategoryDescById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetTwelveBranchCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getOptionalSubjectCategoryDescById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetOptionalSubjectCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getPayscaleCategoryDescById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetPayscaleCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getClusterCategoryDescById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetClusterCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getCastCategoryDescById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetCastCategoryDescById?flag_lang=' + langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSchoolByCriteria(langFlag: string, TalukaId: number, VillageId: number, CenterId: number  ){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSchoolByCriteria?flag_lang='+langFlag+'+&TalukaId='+TalukaId+'&VillageId='+VillageId+'&CenterId='+CenterId+'', false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getEducationalQualificationById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetEducationalQualificationById?flag_lang=' +langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  
  getProfessinalQualificationById(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetProfessinalQualificationById?flag_lang=' +langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllInterDistrictTransferType(langFlag: string){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllInterDistrictTransferType?flag_lang=' +langFlag, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }

  getAllSchoolsByCenterId(langFlag: string, CenterId: number){
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'zp-osmanabad/master/GetAllSchoolsByCenterId?flag_lang='+langFlag+'&CenterId='+CenterId, false, false, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") {obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      });
    });
  }






  

  

}
