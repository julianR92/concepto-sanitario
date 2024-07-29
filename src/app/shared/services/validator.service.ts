import { Injectable } from '@angular/core';
import {
  FormControl,
  ValidationErrors,
  FormGroup,
  AbstractControl,
} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  public firstNameAndLastnamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  public emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public numberPattern: string = '^[0-9]+$';
  public numberStringPattern: string = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑs ]+$';
  public letterPAttern = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$";
  public addressPattern = "^[a-zA-Z0-9#,\-.áéíóúÁÉÍÓÚñÑ ]*$";
  public mulitplePattern = "^[a-zA-Z0-9#,\-.:;áéíóúÁÉÍÓÚñÑ ]*$";

  public cantBeStrider = (control: FormControl): ValidationErrors | null => {
    const value: string = control.value.trim().toLowerCase();

    if (value === 'strider') {
      return {
        noStrider: true,
      };
    }

    return null;
  };

  public isValidField(form: FormGroup, field: string) {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(
    form: FormGroup,
    field: string,
    patternMsg?: string
  ): string | null {
    if (!form.controls[field]) return null;
    const errors = form.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracters.`;
        case 'maxlength':
          return `Maximo ${errors['maxlength'].requiredLength} caracters.`;
        case 'pattern':
          return `${patternMsg ? patternMsg : 'Formato Incorrecto'}`;
        case 'notEqual':
          return `${patternMsg ? patternMsg : 'Los valores no coinciden'}`;
        default:
          return `Error: ${patternMsg ? patternMsg : key}`;
      }
    }

    return null;
  }

  public isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;

      if (fieldValue1 !== fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true });
        return { notEqual: true };
      }

      formGroup.get(field2)?.setErrors(null);
      return null;
    };
  }

  public onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  public onlyLetters(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow control keys (backspace, delete, arrows, etc.)
    if (
      charCode === 8 ||
      charCode === 46 ||
      (charCode >= 37 && charCode <= 40)
    ) {
      return true;
    }
    // Allow letters (both uppercase and lowercase)
    if (
      (charCode >= 65 && charCode <= 90) ||
      (charCode >= 97 && charCode <= 122) ||  charCode === 32 ||
      charCode === 209 || // Ñ
     charCode === 241
    ) {
      return true;
    }
    // Prevent other characters
    event.preventDefault();
    return false;
  }
  public removeLeadingZeros(value: string): string {
    return value.replace(/^0+/, '');
  }
}
