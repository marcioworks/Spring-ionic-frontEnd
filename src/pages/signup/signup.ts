import { ClienteService } from './../../services/domain/cliente.service';
import { CidadeService } from './../../services/domain/cidade.service';
import { EstadoService } from './../../services/domain/estado.service';
import { EstadoDTO } from './../../models/estado.dto';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CidadeDTO } from '../../models/cidade.dto';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formbuilder: FormBuilder,
    public estadoService: EstadoService,
    public cidadesService: CidadeService,
    public clienteService: ClienteService,
    public alertCtrl: AlertController) {

    this.formGroup = this.formbuilder.group({
      name: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
      email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
      tipo: ['1', [Validators.required]],
      cpfOuCnpj: ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
      senha: ['12345', [Validators.required]],
      logadouro: ['rua 4', [Validators.required]],
      numero: ['350', [Validators.required]],
      complemento: ['ap 203', []],
      bairro: ['pedras', []],
      cep: ['60878050', [Validators.required]],
      telefone1: ['99878787', [Validators.required]],
      telefone2: ['', []],
      telefone3: ['', []],
      estadoId: [null, [Validators.required]],
      cidadeId: [null, [Validators.required]]
    });
  }


  ionViewDidLoad() {
    this.estadoService.findAll()
      .subscribe(response => {
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id);
        this.updateCidades();
      },
        error => { });

  }

  signupUser() {  
    this.clienteService.insert(this.formGroup.value)
      .subscribe(response =>{
        this.showInsertOk();
      },
      error =>{}
      );
  }

  showInsertOk(){
    let alert = this.alertCtrl.create({
      title:'Sucesso!',
      message: 'Cliente cadastrado com Sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler:() => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
  updateCidades() {
    let estado_id = this.formGroup.value.estadoId;
    this.cidadesService.findAll(estado_id)
      .subscribe(response => {
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null);
      },
        error => { });

  }

}
