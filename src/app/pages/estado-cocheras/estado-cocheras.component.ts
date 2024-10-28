import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Cochera } from '../../interfaces/cochera';
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { CocherasService } from '../../services/cocheras.service';

@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrl: './estado-cocheras.component.scss'
})


export class EstadoCocherasComponent {
  titulo = 'ESTADO DE COCHERAS';
  header = {
    nro: 'Nro',
    disponibilidad: 'Disponibilidad',
    ingreso: 'Ingreso',
    acciones: 'Acciones',
  };

  filas: Cochera [] = []
  siguienteNumero: number = 1;
  auth = inject(AuthService)
  cocheras = inject(CocherasService)
  estacionamientos = inject(EstacionamientosService)

  agregarFila() {
    this.filas.push({
      descripcion: '-',
      id: this.siguienteNumero,
      deshabilitada: false,
      eliminada: false,
      activo: false
    });
    this.siguienteNumero += 1;
  }
  /** Elimina la fila de la cochera seleccionada */
  eliminarFila(index: number, event:Event) {
    event.stopPropagation()
  this.filas.splice(index, 1);
  }

  /** Cambia la disponibilidad de una cochera, si esta habilitada se deshabilita y viceversa */
  cambiarDisponibilidadCochera(numeroFila: number,event:Event){
    event.stopPropagation()
    if(this.filas[numeroFila].deshabilitada === true){
      this.filas[numeroFila].deshabilitada = false;
    } else {
      this.filas[numeroFila].deshabilitada = true;
    }
    /** Manera corta
    this.filas[numeroFila].disponibilidad = !this.filas[numeroFila].disponibilidad;/**   */
  }

  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    return this.cocheras.cocheras().then(cocheras => {
      this.filas = [];

      for (let cochera of cocheras) {
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        })
      };
    });
  }


   abrirModalNuevoEstacionamiento(idCochera:number){
    Swal.fire({
      title: "Ingrese la patente del vehiculo",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Ingrese una patente valida!";
        }
        return
      }
    }).then(res =>{
      if(res.isConfirmed){
        console.log("Tengo que estacionar la patente",res.value);
      this.estacionamientos.estacionarAuto(res.value,idCochera);
      this.estacionamientos.estacionarAuto(res.value,idCochera).then(()=>{
        this.traerCocheras  
      })
      }
    })
  }
}