import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error(`Error in ${this.name}:`, error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View style={styles.container}>
            <Text style={styles.errorText}>
              {`Failed to load ${this.props.componentName}`}
            </Text>
            {this.state.error && (
              <Text style={styles.errorDetails}>
                {this.state.error.message}
              </Text>
            )}
          </View>
        )
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffeeee',
    borderRadius: 8,
    margin: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  errorText: {
    color: '#cc0000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  errorDetails: {
    color: '#666',
    fontSize: 12,
  },
});

export default ErrorBoundary;
