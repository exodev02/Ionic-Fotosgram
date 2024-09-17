import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RespuestaPosts } from '../interfaces/interfaces';

const URL =  environment.url;

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private http = inject(HttpClient);

  private paginaPosts = 0;

  constructor() { }

  getPosts() {
    this.paginaPosts++;
    return this.http.get<RespuestaPosts>(`${URL}/posts/?pagina=1`);
  }
}
