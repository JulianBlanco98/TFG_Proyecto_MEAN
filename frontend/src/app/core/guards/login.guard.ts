import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthServiceService } from "src/app/services/auth-service.service";

export const loginGuard = () => {

    const router = inject(Router);
    const authService = inject(AuthServiceService);
    //console.log("Estoy en la guarda para ver si existe el token");
    
    if(authService.getToken()){
        return true;
    }
    else{
        router.navigate(['/'])
        return false;
    }
}