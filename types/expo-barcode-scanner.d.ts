declare module 'expo-barcode-scanner' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface BarCodeEvent {
    type: string;
    data: string;
    bounds: {
      width: number;
      height: number;
      origin: {
        x: number;
        y: number;
      };
    };
  }

  export interface BarCodeScannerProps {
    type?: 'front' | 'back' | number;
    barCodeTypes?: string[];
    onBarCodeScanned: (event: BarCodeEvent) => void;
    style?: ViewStyle;
  }

  export const BarCodeScanner: ComponentType<BarCodeScannerProps>;

  export function requestPermissionsAsync(): Promise<{ status: string }>;

  export const Constants: {
    BarCodeType: {
      [key: string]: string;
    };
  };
}
