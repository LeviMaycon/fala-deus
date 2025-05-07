import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of, retry } from 'rxjs';

@Injectable()
export class ApiService {

    constructor(private readonly http: HttpClient) {}

    /**
     * Método para fazer as requisições
     * 
     * @param endpoint endpoint da api
     * @param params parâmetros opcionais da requisição
     * @returns Observable com resposta da api
     */

    
    get<T>(endpoint: string, params?: any): Observable<T> {
        const options = {params: new HttpParams({ fromObject: params || {} })};

        return this.http.get<T>(`/api/${endpoint}`, options).pipe(
            retry(1),
            catchError((error) => {
                console.error('Ocorreu um erro:', error);
                if (error.status === 0) {
                  console.error('Erro de rede ou CORS');
                } else if (error.status === 404) {
                  console.error('Endpoint não encontrado');
                } else {
                  console.error(`Erro ${error.status}: ${error.message}`);
                }
                return of(null as T);
            })
        );
    }
}