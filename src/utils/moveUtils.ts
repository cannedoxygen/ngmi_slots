// src/utils/moveUtils.ts
import { constants } from './constants';

/**
 * Utilities for working with Move smart contracts on Sui
 */

/**
 * Parses a Move event from the blockchain
 * @param event The raw event object from the blockchain
 * @returns A parsed object with event data
 */
export const parseEvent = (event: any): any => {
  try {
    // Check if it's a valid event
    if (!event || !event.type || !event.parsedJson) {
      return null;
    }
    
    // Extract module name and event name from the event type
    // Format is typically "package::module::event_name"
    const parts = event.type.split('::');
    
    if (parts.length !== 3) {
      return null;
    }
    
    const [packageName, moduleName, eventName] = parts;
    
    // Return a structured object
    return {
      packageName,
      moduleName,
      eventName,
      data: event.parsedJson,
      sender: event.sender,
      timestamp: event.timestampMs || Date.now(),
    };
  } catch (error) {
    console.error('Error parsing Move event:', error);
    return null;
  }
};

/**
 * Parses a spin result event from the blockchain
 * @param event The raw event object from the blockchain
 * @returns A structured spin result or null if not a valid spin event
 */
export const parseSpinResultEvent = (event: any): any => {
  const parsedEvent = parseEvent(event);
  
  if (!parsedEvent || 
      parsedEvent.moduleName !== 'ngmi_slots' || 
      parsedEvent.eventName !== 'SpinResult') {
    return null;
  }
  
  // Extract and structure the spin result data
  const { data } = parsedEvent;
  
  return {
    player: data.player,
    betAmount: data.bet_amount,
    winAmount: data.win_amount,
    multiplier: data.multiplier || 1,
    freeSpins: data.free_spins || 0,
    reelPositions: data.reel_positions || [],
    paylines: data.paylines || [],
    timestamp: parsedEvent.timestamp,
  };
};

/**
 * Formats Move call arguments for the contract
 * @param args Raw arguments to format
 * @returns Formatted arguments array
 */
export const formatMoveCallArgs = (args: any[]): any[] => {
  // In a real implementation, this would format args for the Sui SDK
  // For our development version, we'll just return the args
  return args;
};

/**
 * Forms a Move call transaction
 * @param packageId The package ID
 * @param module The module name
 * @param function The function name
 * @param typeArguments Type arguments (if any)
 * @param args Function arguments
 * @returns A transaction object ready to be sent
 */
export const formMoveCallTransaction = (
  packageId: string = constants.contractAddress.packageId,
  module: string = constants.contractAddress.moduleId,
  functionName: string,
  typeArguments: string[] = [],
  args: any[] = []
): any => {
  // In a real implementation, this would create a transaction object
  // For our development version, we'll just return a simple object
  return {
    packageId,
    module,
    function: functionName,
    typeArguments,
    arguments: formatMoveCallArgs(args),
  };
};

/**
 * Extracts Move objects from transaction results
 * @param txResult The transaction result from the blockchain
 * @param objectType The type of object to extract (optional)
 * @returns Array of objects created or modified in the transaction
 */
export const extractObjectsFromTx = (txResult: any, objectType?: string): any[] => {
  // In a real implementation, this would extract objects from tx results
  // For our development version, we'll just return an empty array
  return [];
};

/**
 * Extracts events of a specific type from transaction results
 * @param txResult The transaction result from the blockchain
 * @param eventType The type of event to extract (e.g., "package::module::EventName")
 * @returns Array of matching events
 */
export const extractEventsFromTx = (txResult: any, eventType?: string): any[] => {
  // In a real implementation, this would extract events from tx results
  // For our development version, we'll just return an empty array
  return [];
};

export default {
  parseEvent,
  parseSpinResultEvent,
  formatMoveCallArgs,
  formMoveCallTransaction,
  extractObjectsFromTx,
  extractEventsFromTx,
};