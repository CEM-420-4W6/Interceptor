import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable()
export class SpotifyInterceptor implements HttpInterceptor {

  constructor(public tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('Je suis dans l\'interceptor');

    let url: URL= new URL(request.url);
    console.log(url);

    if(url.hostname === "api.spotify.com")
    {
      console.log('Je modifie l\'entête');
      request = request.clone({
        setHeaders: {
          'Content-Type':  'application/json',
          'Authorization': 'Bearer ' + this.tokenService.token
        }
      });
    }

    return next.handle(request);
  }
}
