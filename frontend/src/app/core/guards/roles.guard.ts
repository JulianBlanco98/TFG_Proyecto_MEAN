import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { AuthServiceService } from "src/app/services/auth-service.service";


export const loginUsuario = () => {
    const router = inject(Router);
    const authService = inject(AuthServiceService);
    

    console.log("He pasao la guarda de log, tengo que ver si ahora es usuario");

    authService.getRolUsuarioToken().subscribe((rol) => {
        if(rol === 'usuario'){
            return true;
        }
        else{
            router.navigate(['/'])
            return false;
        }   
    });
};
export const loginAdmin = () => {

    const router = inject(Router);
    const authService = inject(AuthServiceService);

    console.log("He pasao la guarda de log, tengo que ver si ahora es admin");

    authService.getRolUsuarioToken().subscribe((rol) => {
        if(rol === 'admin'){
            return true;
        }
        else{
            router.navigate(['/'])
            return false;
        }   
    });
};