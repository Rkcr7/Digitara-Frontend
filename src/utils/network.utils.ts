// Network connectivity utilities

// Type for Network Information API (experimental)
interface NetworkInformation {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g'
  downlink?: number
  rtt?: number
  saveData?: boolean
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
  mozConnection?: NetworkInformation
  webkitConnection?: NetworkInformation
}

/**
 * Check if the browser is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine
}

/**
 * Add listener for online/offline events
 */
export const addNetworkListener = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline)
    window.removeEventListener('offline', onOffline)
  }
}

/**
 * Monitor slow network connections
 */
export const isSlowConnection = (): boolean => {
  const nav = navigator as NavigatorWithConnection
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
  
  if (!connection) return false
  
  // Check effective type (slow-2g, 2g, 3g, 4g)
  if (connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
    return true
  }
  
  // Check downlink speed (Mbps)
  if (connection.downlink && connection.downlink < 1) {
    return true
  }
  
  return false
}

/**
 * Format file size with appropriate units
 */
export const getNetworkSpeed = (): string | null => {
  const nav = navigator as NavigatorWithConnection
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
  
  if (!connection) return null
  
  if (connection.effectiveType) {
    return connection.effectiveType.toUpperCase()
  }
  
  if (connection.downlink) {
    return `${connection.downlink} Mbps`
  }
  
  return null
} 