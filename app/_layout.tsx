import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { TailwindProvider } from 'nativewind';

export default function RootLayout() {
  return (
    <TailwindProvider>
      <Stack>
        <StatusBar style="auto" />
        <Slot />
      </Stack>
    </TailwindProvider>
  );
}
