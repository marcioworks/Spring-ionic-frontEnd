import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from './../../config/api.config';
import { StorageService } from './../storage.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ClienteDTO } from '../../models/cliente.dto';

@Injectable()
export class ClienteService {

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    findbyEmail(email: string): Observable<ClienteDTO> {
        let token = this.storage.getLocalUser().token;
        let autheader = new HttpHeaders({ 'Authorization': 'Bearer ' + token });

        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
            { 'headers': autheader });
    }

    getImageFromBucket(id:string):Observable<any>{
        let url =`${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
        return this.http.get(url,{responseType:'blob'});
    }

}