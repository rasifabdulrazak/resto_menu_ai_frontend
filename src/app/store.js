import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        
        setAuth: (user, token) => set({ 
          user, 
          token, 
          isAuthenticated: true 
        }),
        
        logout: () => set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        }),
        
        updateUser: (userData) => set((state) => ({ 
          user: { ...state.user, ...userData } 
        })),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

// UI Store (for global UI state)
export const useUIStore = create(
  devtools(
    (set) => ({
      isSidebarOpen: true,
      isModalOpen: false,
      modalContent: null,
      theme: 'light',
      notifications: [],
      
      toggleSidebar: () => set((state) => ({ 
        isSidebarOpen: !state.isSidebarOpen 
      })),
      
      openModal: (content) => set({ 
        isModalOpen: true, 
        modalContent: content 
      }),
      
      closeModal: () => set({ 
        isModalOpen: false, 
        modalContent: null 
      }),
      
      setTheme: (theme) => set({ theme }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          id: Date.now(),
          ...notification
        }]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
    }),
    { name: 'UIStore' }
  )
);

// Cart Store (Example for restaurant menu)
export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        
        addItem: (item) => set((state) => {
          const existingItem = state.items.find(i => i.id === item.id);
          
          if (existingItem) {
            return {
              items: state.items.map(i =>
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              total: state.total + item.price,
            };
          }
          
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            total: state.total + item.price,
          };
        }),
        
        removeItem: (itemId) => set((state) => {
          const item = state.items.find(i => i.id === itemId);
          if (!item) return state;
          
          return {
            items: state.items.filter(i => i.id !== itemId),
            total: state.total - (item.price * item.quantity),
          };
        }),
        
        updateQuantity: (itemId, quantity) => set((state) => {
          const item = state.items.find(i => i.id === itemId);
          if (!item) return state;
          
          const quantityDiff = quantity - item.quantity;
          
          if (quantity === 0) {
            return {
              items: state.items.filter(i => i.id !== itemId),
              total: state.total - (item.price * item.quantity),
            };
          }
          
          return {
            items: state.items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            ),
            total: state.total + (item.price * quantityDiff),
          };
        }),
        
        clearCart: () => set({ items: [], total: 0 }),
        
        getItemCount: () => {
          return get().items.reduce((total, item) => total + item.quantity, 0);
        },
      }),
      {
        name: 'cart-storage',
      }
    ),
    { name: 'CartStore' }
  )
);

// App Store (for general app state)
export const useAppStore = create(
  devtools(
    persist(
      (set) => ({
        language: 'en',
        currency: 'USD',
        restaurantId: null,
        
        setLanguage: (language) => set({ language }),
        setCurrency: (currency) => set({ currency }),
        setRestaurantId: (restaurantId) => set({ restaurantId }),
      }),
      {
        name: 'app-storage',
      }
    ),
    { name: 'AppStore' }
  )
);