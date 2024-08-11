import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { map, Subscription, tap } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EventService } from 'src/app/services/event.service';

@Directive({
  selector: '[appRoles]'
})
export class RolesDirective implements OnInit, OnDestroy{

  private rolActual: string | null;
  @Input() appRoles: string[];
  sub: Subscription

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly authService: AuthServiceService,
    private readonly eventService: EventService
  ) { 
  }
  
  ngOnInit(): void {
    // Manejo de la autenticación
    if (this.authService.isAuthenticated()) {
      this.sub = this.authService.getRolUsuarioToken().pipe(
        map((rol) => Boolean(rol && this.appRoles?.includes(rol))),
        tap((hasRole) => {
          hasRole ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();
        })
      ).subscribe();
    } else {
      // Manejo cuando no está autenticado (rol 'nologin')
      if (this.appRoles.includes('nologin')) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }

    // Suscripción para recargar los roles cuando cambian
    this.sub = this.eventService.reloadRoles.pipe(
      map((rol) => Boolean(rol && this.appRoles?.includes(rol))),
      tap((hasRole) => {
        hasRole ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
}
