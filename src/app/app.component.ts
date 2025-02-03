import { Component, inject, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ChatComponent } from './chat/chat.component';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { IChannel } from './models';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, ChatComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [SharedModule],
})
export class AppComponent {
  title = 'irc-chat';
  authService = inject(AuthService);
  chatService = inject(ChatService);
  signedIn: boolean;
  constructor() {
    const parsedHash = new URLSearchParams(
      window.location.hash.substring(1) // any_hash_key=any_value
    );
    this.signedIn = this.authService.getToken() !== null;
    if (!this.signedIn) {
      if (parsedHash.get('access_token')) {
        this.authService.addToken(parsedHash);
      }
    }
  }
  redirect() {
    this.authService.redirect();
  }
}
