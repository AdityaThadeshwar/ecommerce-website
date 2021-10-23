import {Component, OnInit} from '@angular/core';

import myAppConfig from '../../config/my-app-config';
import * as OktaSignIn from '@okta/okta-signin-widget';
import {OktaAuth} from '@okta/okta-auth-js'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	oktaSignIn: any;

	constructor(private oktaAuthService: OktaAuth) {
		this.oktaAuthService = new OktaSignIn({
			logo: 'assets/images/logo/png',
			baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
			clientId: myAppConfig.oidc.clientId,
			redirectUri: myAppConfig.oidc.redirectUri,
			authParams: {
				pkce: true,
				issues: myAppConfig.oidc.issuer,
				scopes: myAppConfig.oidc.scopes
			}
		});
	}

	ngOnInit(): void {
		this.oktaSignIn.remove();

		this.oktaSignIn.renderEl({
				el: '#okta-sign-in-widget'  //this name should be same as div tag in login.component.html
			},
			(response) => {
				if (response.status === 'SUCCESS') {
					this.oktaAuthService.signInWithRedirect();
				}
			},
			(error) => {
				throw error;
			}
		)
	}
}
