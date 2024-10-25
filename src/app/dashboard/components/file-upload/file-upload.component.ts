import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',

})
export class FileUploadComponent {
  uploadedFiles: any[] = [];
  @Output() fileSelected = new EventEmitter<File|null>(); // Emitimos el archivo seleccionado

  onSelect(event: any) {
    const file = event.files[0];
    if (file) {
      this.uploadedFiles = [file]; // Emitimos el archivo al componente padre
      this.fileSelected.emit(file)
    }
  }

  // Este método se llama cuando se elimina un archivo
  onRemove() {
    this.uploadedFiles = []; // Limpia la lista de archivos
    this.fileSelected.emit(null); // Emitir null al componente padre
  }
}

