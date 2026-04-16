import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ShiftService } from '../services/shift.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const shiftService = inject(ShiftService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Si no está en la página de fichaje y no tiene turno activo, obligamos a fichar
    // Excepto si es una ruta que no requiere turno (ej: settings tal vez, pero por ahora estricto)
    if (state.url !== '/shift' && !shiftService.hasActiveShift()) {
      router.navigate(['/shift']);
      return false;
    }

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
