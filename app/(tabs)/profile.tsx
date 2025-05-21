import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from 'shadcn-ui';
import { useUser, useSignOut } from '@/lib/supabase';

export default function ProfileScreen() {
  const user = useUser();
  const signOut = useSignOut();

  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-xl font-bold text-text mb-2">Profile</Text>
      <Text className="text-base text-text mb-8">{user?.email}</Text>
      <Button
        className="bg-primary w-full"
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        onPress={signOut}
      >
        Sign Out
      </Button>
    </SafeAreaView>
  );
}
