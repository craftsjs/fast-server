import { EndpointManager } from '../endpoint-manager';

export interface RequestMethods {
  GET?: EndpointManager;
  POST?: EndpointManager;
  PATCH?: EndpointManager;
  PUT?: EndpointManager;
  DELETE?: EndpointManager;
  OPTIONS?: EndpointManager;
  HEAD?: EndpointManager;
  ALL?: EndpointManager;
}
