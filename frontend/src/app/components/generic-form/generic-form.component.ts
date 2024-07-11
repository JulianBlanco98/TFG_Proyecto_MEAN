import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/services/crud.service';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private router: Router,
  ){

  }

  formUsuario = FormGroup

  ngOnInit(): void {
    this.formBuilder.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      correo: ['', Validators.required],
      saldo: ['', Validators.required],
    })
  }

  onSubmit():void{
    console.log("Submit");
    
  }

}
