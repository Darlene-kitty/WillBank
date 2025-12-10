import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Intercepteur HTTP pour ajouter le token JWT aux requêtes
 * et gérer le refresh automatique du token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Ne pas ajouter le token pour les endpoints publics
  const publicEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  
  if (isPublicEndpoint) {
    return next(req);
  }

  // Ajoute le token JWT à la requête
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si erreur 401, tente de rafraîchir le token
      if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          return authService.refreshToken(refreshToken).pipe(
            switchMap(response => {
              // Réessaye la requête avec le nouveau token
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              return next(newReq);
            }),
            catchError(refreshError => {
              // Si le refresh échoue, déconnecte l'utilisateur
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // Pas de refresh token, déconnecte l'utilisateur
          authService.logout();
        }
      }
      
      return throwError(() => error);
    })
  );
};
