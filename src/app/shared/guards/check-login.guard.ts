import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';
import { core } from '@angular/compiler';

export const checkLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService)
  const router = inject(Router);
  if (authService.isAuth()){
      return true;
  }
  else{
    const url = router.createUrlTree(['/iniciar-sesion']);
    return url;
  }
};
