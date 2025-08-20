import { Platform } from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

type UriOperation = 'save' | 'delete' | 'check' | 'display';

/**
 * Minimal URI Manager for rn-login-kit
 * Handles URI processing, normalization, and validation for profile photos
 */
export class UriManager {
  private static instance: UriManager;

  private constructor() {}

  static getInstance(): UriManager {
    if (!this.instance) {
      this.instance = new UriManager();
    }
    return this.instance;
  }

  /**
   * Extracts the filename from a URI string
   */
  public getFilenameFromUri(uri: string): string | null {
    if (!uri) return null;
    try {
      const pathWithoutQuery = uri.split('?')[0];
      const parts = pathWithoutQuery.split('/');
      const filename = parts.pop();
      return filename && filename.length > 0 ? filename : null;
    } catch (e) {
      console.error("UriManager: Error extracting filename from URI:", uri, e);
      return null;
    }
  }

  /**
   * Normalizes a URI for specific operations based on the platform
   */
  public normalizeUriForOperation(uri: string, operation: UriOperation): string {
    if (!uri) return '';

    let processedUri = uri;

    if (processedUri.startsWith('photo://')) {
      processedUri = processedUri.replace('photo://', '');
    }

    const hasFilePrefix = processedUri.startsWith('file://');

    if (Platform.OS === 'android') {
      if ((operation === 'save' || operation === 'delete') && hasFilePrefix) {
        processedUri = processedUri.replace('file://', '');
      }
      else if ((operation === 'check' || operation === 'display') && !hasFilePrefix) {
         if (!processedUri.startsWith('content://')) {
            processedUri = `file://${processedUri}`;
         }
      }
    } else if (Platform.OS === 'ios') {
      if (!hasFilePrefix) {
        processedUri = `file://${processedUri}`;
      }
    }

    return processedUri;
  }

  /**
   * Gets all possible variations of a photo URI to try
   */
  private getPhotoUriVariations(uri: string): string[] {
    if (!uri) return [];
    
    const variations: string[] = []; 
    const filename = this.getFilenameFromUri(uri);

    if (!filename) {
        variations.push(uri); 
        if (uri.startsWith('file://')) variations.push(uri.substring(7));
        else variations.push(`file://${uri}`);
        return [...new Set(variations)];
    }
    
    if (Platform.OS === 'ios') {
      const documentsPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
      variations.push(`file://${documentsPath}`);
      variations.push(documentsPath);
      
      if (uri.includes('/Containers/Data/Application/')) {
        const containerRegex = /^(.*\/Containers\/Data\/Application\/[^\/]+)(\/Documents\/.*)$/;
        const match = uri.match(containerRegex);

        if (match && match.length > 2) {
          const libraryPath = RNFS.LibraryDirectoryPath;
          if (libraryPath) {
             const libraryParts = libraryPath.split('/');
             const currentContainerPathBase = libraryParts.slice(0, libraryParts.indexOf('Library')).join('/');
             if(currentContainerPathBase) {
                 variations.push(`${currentContainerPathBase}${match[2]}`);
                 variations.push(`file://${currentContainerPathBase}${match[2]}`);
             }
          }
        }
      }
      
      variations.push(uri);
      if (uri.startsWith('file://')) {
        variations.push(uri.substring(7));
      } else {
        variations.push(`file://${uri}`);
      }
    } else {
      variations.push(uri);
      if (uri.startsWith('file://')) {
        variations.push(uri.substring(7));
      } else if (!uri.startsWith('content://')) {
        variations.push(`file://${uri}`);
      }
    }
    
    return [...new Set(variations)];
  }

  /**
   * Scans device for possible locations of a photo by filename (iOS only)
   */
  private async scanDeviceForPhoto(filename: string): Promise<string[]> {
    if (Platform.OS !== 'ios' || !filename) return [];
    
    const possiblePaths: string[] = [];
    
    try {
      const currentDocPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
      possiblePaths.push(`file://${currentDocPath}`);
      possiblePaths.push(currentDocPath);
      
      const libraryPathScan = RNFS.LibraryDirectoryPath;
      if (libraryPathScan) {
        const libraryParts = libraryPathScan.split('/');
        const appBasePath = libraryParts.slice(0, libraryParts.indexOf('Library')).join('/');
        
        if (appBasePath && appBasePath.includes('/Containers/Data/Application')) {
          const containersBasePath = appBasePath.substring(0, appBasePath.lastIndexOf('/'));

          try {
            const containers = await RNFS.readDir(containersBasePath);
            
            for (const container of containers) {
              if (container.isDirectory() && container.name !== appBasePath.substring(appBasePath.lastIndexOf('/') + 1)) {
                const potentialDocPath = `${container.path}/Documents/${filename}`;
                try {
                  if (await RNFS.exists(potentialDocPath)) {
                     possiblePaths.push(`file://${potentialDocPath}`);
                     possiblePaths.push(potentialDocPath);
                  }
                } catch { /* Ignore errors checking individual paths */ }
              }
            }
          } catch (readDirError) {
            // Permission issue on device
          }
        }
      }
    } catch (error) {
      console.warn('UriManager: Error during device scan heuristic:', error);
    }
    
    return [...new Set(possiblePaths)];
  }

  /**
   * Checks if a file exists at the given URI, trying multiple variations
   */
  public async findExistingFileUri(uri: string): Promise<{ exists: boolean; workingUri?: string }> {
    if (!uri) return { exists: false };

    try {
      const variations = this.getPhotoUriVariations(uri);

      for (const variant of variations) {
        const normalizedUri = this.normalizeUriForOperation(variant, 'check');
        try {
          if (await RNFS.exists(normalizedUri)) {
            return { exists: true, workingUri: normalizedUri };
          }
        } catch (rnfsError) {
          // Continue to the next variation
        }
      }

      const filename = this.getFilenameFromUri(uri);
      if (Platform.OS === 'ios' && filename) {
        try {
            const scannedPaths = await this.scanDeviceForPhoto(filename);
            for (const path of scannedPaths) {
                const normalizedScannedPath = this.normalizeUriForOperation(path, 'check');
                if (await RNFS.exists(normalizedScannedPath)) {
                    return { exists: true, workingUri: normalizedScannedPath };
                }
            }
        } catch (scanError) {
            console.error(`UriManager: Error during device scan for ${filename}:`, scanError);
        }
      }

      return { exists: false };
    } catch (error) {
      console.error('UriManager: Error in findExistingFileUri for:', uri, error);
      return { exists: false };
    }
  }

}

export const uriManager = UriManager.getInstance(); 