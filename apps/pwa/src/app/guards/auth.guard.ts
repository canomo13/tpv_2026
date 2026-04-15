import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const expectedRole = route.data['role'];
    if (expectedRole && !authService.hasRole(expectedRole)) {
      // Redirigir según su propio rol si intenta entrar donde no debe
      const userRole = authService.currentUser()?.role;
      if (userRole === 'ADMIN') router.navigate(['/floor-plan']);
      else if (userRole === 'KITCHEN') router.navigate(['/kitchen']);
      else router.navigate(['/handheld']);
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};
