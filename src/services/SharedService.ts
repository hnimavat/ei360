// SharedService.ts
import { ServiceScope } from '@microsoft/sp-core-library';

export interface ISharedService {
  broadcastSelection(selectedOption: string): void;
  subscribe(callback: (selectedOption: string) => void): void;
}

export class SharedService implements ISharedService {
  private selectedOption: string = '';
  private callbacks: ((selectedOption: string) => void)[] = [];

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      // Initialization logic, if needed
    });
  }

  public broadcastSelection(selectedOption: string): void {
    this.selectedOption = selectedOption;
    this.callbacks.forEach(callback => callback(selectedOption));
  }

  public subscribe(callback: (selectedOption: string) => void): void {
    this.callbacks.push(callback);
    // Optionally, you can provide the current selection when a new subscriber joins.
    callback(this.selectedOption);
  }
}
