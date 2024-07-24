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

    if(this.authService.isAuthenticated()){

      this.sub = this.authService.getRolUsuarioToken().pipe(
        map((rol) => Boolean(rol && this.appRoles?.includes(rol))),
        tap((hasRole) => {
          // console.log("Event service: ", this.eventService.reloadRoles);
          hasRole ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear()
        })
      ).subscribe()
    }
    this.sub = this.eventService.reloadRoles.pipe(
      map((rol) => Boolean(rol && this.appRoles?.includes(rol))),
      tap((hasRole) => {
        // console.log("Event service: ", this.eventService.reloadRoles);
        hasRole ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear()
      })
    ).subscribe()
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  
}
