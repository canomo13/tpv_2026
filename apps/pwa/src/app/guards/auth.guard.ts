import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ShiftService } from '../services/shift.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const shiftService = inject(ShiftService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const userRole = authService.currentUser()?.role;
    const isShiftPage = state.url === '/shift';
    
    // Si no tiene turno activo y NO es admin, obligamos a fichar (excepto en la propia pág. de fichaje)
    // Los Admins pueden navegar por el diseñador e inventario sin haber fichado turno de camarero.
    if (!isShiftPage && !shiftService.hasActiveShift() && userRole !== 'ADMIN') {
      router.navigate(['/shift']);
      return false;
    }

    const expectedRole = route.data['role'];
    if (expectedRole && !authService.hasRole(expectedRole)) {
      // Redirigir según su propio rol
      if (userRole === 'ADMIN') router.navigate(['/floor-plan']);
      else if (userRole === 'KITCHEN') router.navigate(['/kitchen']);
      else router.navigate(['/shift']); // Waiter sin turno va a /shift
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};
