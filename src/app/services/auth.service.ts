import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor() {}

  async login(credentials: { email: string; password: string }): Promise<void> {
    // Simulate a login process
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      this.isAuthenticated = true;
    } else {
      throw new Error('Invalid email or password');
    }
  }

  async register(credentials: { email: string; password: string }): Promise<void> {
    // Simulate a registration process
    if (credentials.email && credentials.password.length >= 6) {
      this.isAuthenticated = true;
    } else {
      throw new Error('Invalid registration details');
    }
  }

  async logout(): Promise<void> {
    // Simulate a logout process
    this.isAuthenticated = false;
  }

  async isLoggedIn(): Promise<boolean> {
    // Simulate checking authentication status
    return this.isAuthenticated;
  }
}