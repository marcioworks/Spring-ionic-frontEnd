import { FieldMessage } from './../models/fieldmessage';
import { StorageService } from './../services/storage.service';
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { AlertController } from 'ionic-angular';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req)
            .catch((error, caught) => {
                let errorObj = error;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }

                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }


                console.log("error detectado pelo interceptor");
                console.log(errorObj);

                switch (errorObj.status) {
                    case 401:
                        this.handle401();
                        break;

                    case 403:
                        this.handle403();
                        break;

                    case 422:
                        this.handle422(errorObj);
                        break;
                    default:
                        this.handleDefautError(errorObj);


                }
                return Observable.throw(errorObj);
            }) as any;
    }


    handle403() {
        this.storage.setLocalUser(null);
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'erro 401: Falha na autenticação',
            message: 'Email ou senha invalido',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle422(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'erro 422: Validação',
            message: this.listErros(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    
}

handleDefautError(errorObj){
    let alert = this.alertCtrl.create({
        title: 'erro ' + errorObj.status + ': ' + errorObj.error,
        message: errorObj.message,
        enableBackdropDismiss: false,
        buttons: [
            {
                text: 'Ok'
            }
        ]
    });
    alert.present();
}

    private listErros(messages: FieldMessage[]): string {
    let s: string = '';
    for (var i = 0; i < messages.length; i++) {
        s = s + '<p><strong>' + messages[i].fieldname + "</strong>: " + messages[i].message + '</p>';
    }
    return s;
}
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};