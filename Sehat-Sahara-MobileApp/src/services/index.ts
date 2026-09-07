import { SehatSaharaService } from './SehatSaharaService';
import { StaticService } from './StaticService';
import { PrototypeService } from './PrototypeService';
import { ApiService } from './ApiService';
import { ServiceMode } from '../models';

export * from './SehatSaharaService';
export * from './StaticService';
export * from './PrototypeService';
export * from './ApiService';

let currentService: SehatSaharaService = new PrototypeService();

export function getService(mode?: ServiceMode): SehatSaharaService {
  if (!mode) return currentService;
  switch (mode) {
    case 'STATIC':
      return new StaticService();
    case 'DEMO':
      return new PrototypeService();
    case 'API':
      return new ApiService();
    default:
      return currentService;
  }
}

export function setServiceMode(mode: ServiceMode): void {
  currentService = getService(mode);
}
