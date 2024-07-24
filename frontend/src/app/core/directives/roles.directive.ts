import { Directive, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Directive({
  selector: '[appRoles]'
})
export class RolesDirective implements OnInit, OnChanges{

  private rolActual: string | null;
  @Input() appRoles: string[];

  constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly viewContainer: ViewContainerRef,
    private readonly authService: AuthServiceService
  ) { 
  }
  
  ngOnInit(): void {
    
    this.rolActual = this.authService.getRolUsuarioToken();
    console.log("Rol de la persona desde la directiva: ", this.rolActual);
    console.log("Roles array: ", this.appRoles);
    

    if(this.appRoles.includes(this.rolActual)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else{
      this.viewContainer.clear();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("Rol de la persona desde la directiva en el changes: ", this.rolActual);
    console.log("Roles array en el changes: ", this.appRoles);
    
  }
  
}
