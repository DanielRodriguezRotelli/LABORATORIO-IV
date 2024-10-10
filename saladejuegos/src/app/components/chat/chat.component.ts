import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, AfterContentChecked, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message';
import { addDoc, collection, collectionData, Firestore } from  '@angular/fire/firestore';
import { Timestamp, orderBy, query } from 'firebase/firestore';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged } from 'firebase/auth';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
 
  @ViewChild('chatContainer') chatContainer!: ElementRef; // Asegúrate de que esto sea correcto
  @ViewChild('messageContainer') messageContainer!: ElementRef; // Referencia al contenedor de mensajes
  public chat: Message[] = [];
  newMessage: string = '';
  user: string = "";
  dateOptions : Intl.DateTimeFormatOptions = { 
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  showChat: boolean = false; // Estado del chat (minimizado o no)
  private openedChat: boolean = false; // Nuevo estado para saber si el chat acaba de abrirse
  isAtBottom: boolean = true; // Estado para verificar si el usuario está en la parte inferior

  constructor(private firestore: Firestore,
              public auth: Auth){}

  ngOnInit(): void {
    // Escuchar los cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.user = user?.email || 'usuario desconocido'; // Asigna el correo del usuario o 'usuario desconocido'
    });
    this.getData();
  }

  ngAfterViewChecked(): void {
    if (this.showChat && this.isAtBottom) {
      this.scrollToBottom(); // Asegurarse de hacer scroll cuando cambia la vista
    }
  }

  sendMessage() {
    if (this.newMessage ==="") {
      return;
    }
    if (this.auth.currentUser) { // Verifica si el usuario está logueado
      const message: Message = {
        user: this.user,
        text: this.newMessage,
        timestamp: Timestamp.fromDate(new Date)
      };
      let col = collection(this.firestore, 'chat');
      addDoc(col, message)
      this.newMessage = '';
 
    }
  }

  getData(){
    let col = collection(this.firestore, 'chat');
      
    const orderQuery = query(col,orderBy('timestamp','asc'));

    const observable = collectionData(orderQuery);

    observable.subscribe((respuesta:any) => {

      this.chat = respuesta;
      if (this.showChat && this.isAtBottom) {
        this.scrollToBottom(); // Hacer scroll hacia abajo cuando llegan nuevos mensajes
      }
    });
  }

  scrollToBottom(): void {
    if (this.messageContainer && this.messageContainer.nativeElement) {
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }, 100); // Un pequeño retardo para asegurar que el DOM está actualizado
    }
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    // Verificar si el usuario está en la parte inferior
    this.isAtBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
  }

  // Método que se ejecuta cuando el chat se abre
  openChat(): void {
    this.showChat = true;
    setTimeout(() => {
      this.scrollToBottom(); // Desplazar al mensaje más reciente al abrir el chat
    }, 100); // Un pequeño retardo para asegurar que el DOM está actualizado
  }
/*
  isUserAtBottom(): boolean {
    const threshold = 150;
    const position = this.messageContainer.nativeElement.scrollTop + this.messageContainer.nativeElement.clientHeight;
    const height = this.messageContainer.nativeElement.scrollHeight;
    return position >= height - threshold;
  }*/

  getLocaleString(date: Timestamp){
    return new Date(date.seconds*1000).toLocaleString('es-AR', this.dateOptions);
  }  
}
