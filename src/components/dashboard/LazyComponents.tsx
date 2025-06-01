
import { lazy } from 'react';

// Lazy loading dos componentes principais do dashboard
export const LazyVideoManagement = lazy(() => 
  import('./VideoManagement').then(module => ({ default: module.VideoManagement }))
);

export const LazyClientManagement = lazy(() => 
  import('./ClientManagement').then(module => ({ default: module.ClientManagement }))
);

// Lazy loading dos formulários
export const LazyVideoForm = lazy(() => 
  import('../forms/VideoForm').then(module => ({ default: module.VideoForm }))
);

export const LazyClientForm = lazy(() => 
  import('../forms/ClientForm').then(module => ({ default: module.ClientForm }))
);

export const LazyEditVideoForm = lazy(() => 
  import('../forms/EditVideoForm').then(module => ({ default: module.EditVideoForm }))
);

// Lazy loading de componentes específicos
export const LazyClientVideoView = lazy(() => 
  import('./video-management/ClientVideoView').then(module => ({ default: module.ClientVideoView }))
);
