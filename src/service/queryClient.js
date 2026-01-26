import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global query options
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      
      // Error handling
      onError: (error) => {
        console.error('Query Error:', error);
      },
    },
    mutations: {
      // Global mutation options
      retry: 1,
      
      // Error handling
      onError: (error) => {
        console.error('Mutation Error:', error);
      },
    },
  },
});

// Query keys factory for better organization
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'],
    session: ['auth', 'session'],
  },
  
  // Menu
  menu: {
    all: ['menu'],
    list: (filters) => ['menu', 'list', filters],
    detail: (id) => ['menu', 'detail', id],
    categories: ['menu', 'categories'],
  },
  
  // Orders
  orders: {
    all: ['orders'],
    list: (filters) => ['orders', 'list', filters],
    detail: (id) => ['orders', 'detail', id],
  },
  
  // Restaurants
  restaurants: {
    all: ['restaurants'],
    list: (filters) => ['restaurants', 'list', filters],
    detail: (id) => ['restaurants', 'detail', id],
  },
  
  // Add more query keys as needed
};

export default queryClient;