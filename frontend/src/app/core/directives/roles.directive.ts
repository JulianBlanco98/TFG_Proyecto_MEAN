import { Directive, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { map, Subscription, tap } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { EventService } from 'src/app/services/event.service';

@Directive({
  selector: '[appRoles]'
})
export class RolesDirective implements OnInit, OnDestroy {

  private sub: Subscription;

  @Input() appRoles: string[];

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly authService: AuthServiceService,
    private readonly eventService: EventService
  ) {}

  ngOnInit(): void {
    this.handleRoles();
    
    // Suscripción para recargar los roles cuando cambian
    this.sub = this.eventService.reloadRoles.subscribe(() => {
      this.handleRoles();
    });
  }

  private handleRoles(): void {
    // Limpia la vista actual para evitar duplicados
    this.viewContainer.clear();

    if (this.authService.isAuthenticated()) {
      this.authService.getRolUsuarioToken().pipe(
        map((rol) => Boolean(rol && this.appRoles?.includes(rol))),
        tap((hasRole) => {
          if (hasRole) {
            this.viewContainer.createEmbeddedView(this.templateRef);
          }
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
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

