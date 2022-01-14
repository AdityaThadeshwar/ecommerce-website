import {Component, OnInit} from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';

@Component({
	selector: 'app-login-status',
	templateUrl: './login-status.component.html',
	styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

	isAuthenticated: boolean = false;
	userFullName: string;

	storage: Storage = sessionStorage;
	cartStorage: Storage = localStorage;

	constructor(private oktaAuthService: OktaAuthService) {
	}

	ngOnInit(): void {

		// Subscribe to authentication state changes
		this.oktaAuthService.$authenticationState.subscribe(
			(result) => {
				this.isAuthenticated = result;
				this.getUserDetails();
			}
		);

	}

	getUserDetails() {
		if (this.isAuthenticated) {

			// Fetch the logged in user details (user's claims)
			//
			// user full name is exposed as a property name
			this.oktaAuthService.getUser().then(
				(res) => {
					//Retrieve user's name
					this.userFullName = res.name;

					//Retrieve user's email address
					const theEmail = res.email;

					//store email in browser storage
					this.storage.setItem('userEmail', JSON.stringify(theEmail));
				}
			);
		}
	}

	logout() {

		// Terminates the session with Okta and removes current tokens.
		this.oktaAuthService.signOut();

		//clear storage on logout
		this.storage.clear()
		this.cartStorage.clear();

	}
}
