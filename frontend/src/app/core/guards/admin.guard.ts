import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthServiceService } from "src/app/services/auth-service.service";

export const loginAdmin = () => {

    const router = inject(Router);
    const authService = inject(AuthServiceService);
    console.log("He pasao la guarda de log, tengo que ver si ahora es admin");

    if(authService.getRolUsuarioToken() === 'admin'){
        return true;
    }
    else{
        router.navigate(['/'])
        return false;
    }   
}