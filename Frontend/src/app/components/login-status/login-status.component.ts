import {Component, OnInit} from '@angular/core';
import {OktaAuth} from "@okta/okta-auth-js";

@Component({
	selector: 'app-login-status',
	templateUrl: './login-status.component.html',
	styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

	isAuthenticated: boolean = false;
	userFullName: string;

	constructor(private oktaAuthService: OktaAuth) {
	}

	ngOnInit(): void {

		//subscribe to authentication state changes
		this.oktaAuthService.$authenticationState.subscribe(
			(result) => {
				this.isAuthenticated = true;
				this.getUserDetails();
			}
		);
	}

	getUserDetails() {

		if (this.isAuthenticated) {
			//fetch the logged in user details (user's claims)
			//user full name is exposed as property name
			this.oktaAuthService.getUser().then(
				(res) => {
					this.userFullName = res.name;
				}
			)
		}
	}

	logout() {
		//Terminates the session with okta and removes current tokens
		this.oktaAuthService.signOut();
	}

}
