import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {OktaAuthService} from "@okta/okta-angular";
import {environment} from "../../environments/environment";

@Injectable({
	providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

	constructor(private oktaAuth: OktaAuthService) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return from(this.handleAccess(request, next));
	}

	private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

		//Only add an access token for secured endpoints
		const theEndpoint = environment.applicationUrl + '/orders';
		const securedEndpoints = [theEndpoint];

		console.log('inside handleAccess')

		//check if url matches with above array
		if(securedEndpoints.some(url => request.urlWithParams.includes(url))) {

			console.log('securedEndpoints matched')

			//get access token
			const accessToken = await this.oktaAuth.getAccessToken();

			//close request and add new access token. Clone because request is immutable
			request = request.clone( {
				setHeaders: {
					Authorization: 'Bearer ' + accessToken
				}
			});
		}

		//Continue with other interceptors that are in the chain. If none then make call to the given resp api
		return next.handle(request).toPromise();
	}
}
