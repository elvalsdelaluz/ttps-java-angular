import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray} from '@angular/forms';
import { BillService } from '../../../services/bill/bill.service';
import { LoginService } from '../../../services/auth/login.service';
import { User as AuthUser } from '../../../services/auth/user';
import { User } from '../../group/group';
import { BalanceResponse } from '../../../services/bill/balanceResponse';
import { PayService } from '../../../services/pay/pay.service';
import { PayRequest } from '../../../services/pay/payRequest';

@Component({
  selector: 'app-group-balance',
  templateUrl: './group-balance.component.html',
  styleUrl: './group-balance.component.css'
})
export class GroupBalanceComponent {
  tengo_deuda = false; //En esta variable me indica si el usuario logueado tiene deduas o no

  saldos?: BalanceResponse[];
  idGrupo?: string; // Declaración de idGrupo

  usuario?: AuthUser;

  miembros: User[]=[]

liquidationForm = this.fb.group({
    monto: [0, [Validators.required, this.montoMayorQueCero]],
    miembro:['',[Validators.required]],
  });


tieneDeuda(control: FormControl){
  const email_al_que_le_pago = control.value;
  if (email_al_que_le_pago != null && this.validarSiMeDebeAlgo(email_al_que_le_pago)){
      return { 'noTieneDeuda': true};
  }
  return null;
}

validarSiMeDebeAlgo(email_al_que_le_pago: string): boolean{
  console.log("Estoy en SI ME DEBE ALGO")
  // Buscar el usuario con el email buscado en el balanceResponse
  const misAcredores = this.saldos?.find(balance => balance.email === this.usuario?.email);
  console.log("Mis acreedores: ", misAcredores)
  // Si el usuario no se encuentra, retornar 0
  if (!misAcredores) {
      return true;
  }

  // Buscar la deuda del usuario con el email buscado
  const deuda = misAcredores.deudas.find(deuda => deuda.email === email_al_que_le_pago);
  console.log("Existe deuda: ", deuda)
  // Si no existe la deuda retorno falso
  if (!deuda) {
      return true;
  }

  return false;
}

montoMayorQueCero(control: FormControl) { 
  //Este validador chequea que el monto no sea negativo ni cero
  const monto = control.value;
  if (monto != null && monto <= 0) {
    return { 'montoInvalido': true };
  }
  return null;
}


esMayor (monto:number):boolean{
  console.log("Estoy en ES MAYOR")
  const email_al_que_le_pago = this.liquidationForm.get('miembro')?.value ?? '';

  //Me quedo con mis acreedores o gente que me debe cariño
  const misAcredores = this.saldos?.find(balance => balance.email === this.usuario?.email);

  //Si no existo 
  if (!misAcredores) {
      return false;
  }

  // Buscar la deuda del usuario con el email buscado
  const deuda = misAcredores.deudas.find(deuda => deuda.email === email_al_que_le_pago);
  console.log("Existe deuda: ", deuda)
  // Si no existe la deuda retorno falso
  if (!deuda) {
      return false;
  }

  return monto > deuda.monto ;
}

montoMayorQueDeuda(control: FormControl) { 
  //Este metodo chequea que el monto no sea mayor a la deuda
  //Para esto necesito saber a la persona a la que se le paga
  const monto = control.value;
  if (monto != null && this.esMayor(monto)) {
    return { 'montoMayor': true };
  }
  return null;
}



constructor(private fb:FormBuilder, private router: Router, private route: ActivatedRoute, private billService: BillService,
              private authService: LoginService, private payService: PayService ) {}

ngOnInit() {
    this.usuario = this.authService.userValue;
   
    //Me guardo el id que viene en la url
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo']; // Asignación de idGrupo
    });

     //Recupero los miembros del grupo
     this.billService.miembros$.subscribe((users) => {
      this.miembros = users;
      console.log("Estos son los miembros",this.miembros);
    });
    this.cargarSaldos();


  } 

  cargarSaldos(){
      // Llamada para obtener saldos
    this.billService.getSaldos(this.idGrupo).subscribe(
    saldos => {
      this.saldos = saldos;
      console.log("Gastos:",this.saldos)
      console.log("USUARIO TIENE DEUDA", this.tengo_deuda);
      this.tengo_deuda = this.evaluarSiElUsuarioAutenticadoTieneDeudas(saldos);
      console.log("USUARIO TIENE DEUDA", this.tengo_deuda);
    },
    error => {
      console.error('Error al obtener grupos', error);
    }
    );
  }

evaluarSiElUsuarioAutenticadoTieneDeudas(saldos1:BalanceResponse[]):boolean{
  console.log(saldos1)
  console.log(this.usuario)
  // Iterar sobre cada objeto BalanceResponse en el arreglo balanceResponse
  for (const balance of saldos1) {
    // Verificar si el email autenticado está presente en alguna de las deudas
    if (balance.deudas.some(deuda => deuda.email === this.usuario?.email)) {
        return true; // Si se encuentra el email, retornar true
    }
  }
  // Si el email no se encuentra en ninguna deuda, retornar false
  return false;
}

liquidarDeuda(){
  console.log("cargar formulario de liquidacion");
  if (this.liquidationForm.valid) {

      const montoControl = this.liquidationForm.get('monto');
      let montoIngresado: number | undefined;
      if (montoControl && typeof montoControl.value === 'number') {
        montoIngresado = montoControl.value;
      }

    const payRequest: PayRequest = {
      monto: montoIngresado || 0,
      id_acreedor:this.liquidationForm.get('miembro')?.value ?? '',
      id_deudor: this.usuario?.id_usuario || 0
    };

    this.payService.addPay(payRequest, this.idGrupo).subscribe({
      next: (userData) => {
        console.log(userData);
      },
      error: (errorData) => {
        console.error(errorData);
      },
      complete: () => {
        console.info("Se pago todo");
        this.cargarSaldos();
        this.liquidationForm.reset();
      }
    });
  }
  else {
    this.liquidationForm.markAllAsTouched();
    alert("Error al ingresar los datos.");
  }

  
}

get monto(){
  return this.liquidationForm.controls.monto;
}


get miembro(){
  return this.liquidationForm.controls.miembro;
}


}
