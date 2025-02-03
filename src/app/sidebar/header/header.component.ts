import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  chatService = inject(ChatService);
  authService = inject(AuthService);
  userName = this.chatService.userName;
  channelToAdd: string = '';
  modalVisable = false;
  constructor() {}
  ngOnInit(): void {
    const menuButton = document.getElementById('menuButton')!;
    const menuDropdown = document.getElementById('menuDropdown')!;
    menuButton.addEventListener('click', () => {
      if (menuDropdown.classList.contains('hidden')) {
        menuDropdown.classList.remove('hidden');
      } else {
        menuDropdown.classList.add('hidden');
      }
    });
    document.addEventListener('click', (e: any) => {
      if (!menuDropdown.contains(e.target) && !menuButton.contains(e.target)) {
        menuDropdown.classList.add('hidden');
      }
    });
  }

  submit() {
    if (this.channelToAdd) {
      this.chatService.join(this.channelToAdd);
      this.hideModal();
    }
  }

  showModal() {
    this.modalVisable = true;
  }
  hideModal() {
    this.modalVisable = false;
    this.channelToAdd = '';
  }

  logout() {
    this.chatService.removeChannels();
    this.authService.logout();
  }
}
