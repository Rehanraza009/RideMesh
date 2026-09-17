// ==============================================================================
// RIDEMESH CENTRAL APPLICATION CONTEXT & REAL-TIME MOBILITY STATE
// Production Two-Mode Architecture: Passenger Mode | Driver Mode | Both Mode
// ==============================================================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';
import { userService } from '../services/userService';
import { rideService, RIDE_STATUS } from '../services/rideService';
import { rideRequestService, REQUEST_STATUS } from '../services/rideRequestService';
import { chatService } from '../services/chatService';
import { aiService } from '../services/aiService';
import { sustainabilityService } from '../services/sustainabilityService';
import { earningsService } from '../services/earningsService';

const RideMeshContext = createContext(null);

export const RideMeshProvider = ({ children }) => {
  // Screen Navigation State
  // 1: Splash, 2-4: Onboarding, 5: Login, 6: Signup, 7: ChooseRole, 8: Home (Passenger), 22: Home (Driver)
  const [currentScreen, setCurrentScreen] = useState(1);
  const [history, setHistory] = useState([1]);

  // Dark Mode Theme (persisted)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ridemesh_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ridemesh_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // UI Modals & Sheets
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isGooglePickerOpen, setIsGooglePickerOpen] = useState(false);
  const [isDestinationSearchOpen, setIsDestinationSearchOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isLocationPermissionModalOpen, setIsLocationPermissionModalOpen] = useState(false);

  // Driver Active Confirmed Ride State (Section 14 & 24)
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [confirmedRide, setConfirmedRide] = useState(null);

  // AI Matching Loading State
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiLoadingStep, setAiLoadingStep] = useState(1);

  // Authenticated User Profile
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // User Role & Active Mode
  // role: 'passenger' | 'driver' | 'both'
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('ridemesh_role') || 'passenger';
  });

  // activeMode: 'passenger' | 'driver' (determines which dashboard/tabs render)
  const [activeMode, setActiveModeState] = useState(() => {
    const saved = localStorage.getItem('ridemesh_active_mode');
    if (saved) return saved;
    const initialRole = localStorage.getItem('ridemesh_role');
    return initialRole === 'driver' ? 'driver' : 'passenger';
  });

  const setRole = useCallback((newRole) => {
    setRoleState(newRole);
    localStorage.setItem('ridemesh_role', newRole);
    const targetMode = newRole === 'driver' ? 'driver' : 'passenger';
    setActiveModeState(targetMode);
    localStorage.setItem('ridemesh_active_mode', targetMode);
    if (user?.uid) {
      userService.updateRole(user.uid, newRole).catch(() => {});
    }
  }, [user?.uid]);

  // Instant seamless mode switcher (for users who choose "Both")
  const toggleActiveMode = useCallback(() => {
    setActiveModeState(prev => {
      const next = prev === 'passenger' ? 'driver' : 'passenger';
      localStorage.setItem('ridemesh_active_mode', next);
      setCurrentScreen(next === 'driver' ? 22 : 8);
      return next;
    });
  }, []);

  const setActiveMode = useCallback((newMode) => {
    setActiveModeState(newMode);
    localStorage.setItem('ridemesh_active_mode', newMode);
    setCurrentScreen(newMode === 'driver' ? 22 : 8);
  }, []);

  // Check saved session or listen to Firebase
  useEffect(() => {
    const savedSession = localStorage.getItem('ridemesh_user_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.user) {
          setUser({
            uid: parsed.user.uid,
            name: parsed.profile?.fullName || parsed.user.displayName || 'Mohd Rehan',
            fullName: parsed.profile?.fullName || parsed.user.displayName || 'Mohd Rehan',
            email: parsed.user.email || 'rehan.demo@gmail.com',
            phone: parsed.profile?.phoneNumber || '+91 98765 43210',
            phoneNumber: parsed.profile?.phoneNumber || '+91 98765 43210',
            avatar: parsed.profile?.photoURL || parsed.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            rating: parsed.profile?.rating || 4.9,
            rides: parsed.profile?.totalRides || 28,
            totalRides: parsed.profile?.totalRides || 28,
            verified: true,
            vehicle: parsed.profile?.vehicle || null,
            isDemo: parsed.profile?.isDemo || false
          });
          if (parsed.profile?.role) {
            setRoleState(parsed.profile.role);
          }
          if (parsed.profile?.activeMode) {
            setActiveModeState(parsed.profile.activeMode);
          }
        }
      } catch {}
    }

    const unsub = authService.onAuthStateChange(async (authData) => {
      if (authData?.user) {
        const profile = authData.profile || {};
        setUser({
          uid: authData.user.uid,
          name: profile.fullName || authData.user.displayName || 'Mohd Rehan',
          fullName: profile.fullName || authData.user.displayName || 'Mohd Rehan',
          email: authData.user.email || 'rehan@ridemesh.ai',
          phone: profile.phoneNumber || '+91 98765 43210',
          phoneNumber: profile.phoneNumber || '+91 98765 43210',
          avatar: profile.photoURL || authData.user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          rating: profile.rating || 4.8,
          rides: profile.totalRides || 24,
          totalRides: profile.totalRides || 24,
          verified: profile.verified ?? true,
          vehicle: profile.vehicle || null
        });

        if (profile.role) {
          setRoleState(profile.role);
          localStorage.setItem('ridemesh_role', profile.role);
          const targetMode = profile.role === 'driver' ? 'driver' : 'passenger';
          setActiveModeState(targetMode);
          localStorage.setItem('ridemesh_active_mode', targetMode);
        }
      }
      setAuthInitialized(true);
    });

    return () => unsub();
  }, []);

  // Demo Google Login Helper
  const loginWithDemo = useCallback(async (accountKey) => {
    const res = await authService.loginWithDemoAccount(accountKey);
    if (res.success) {
      setUser({
        uid: res.user.uid,
        name: res.profile.fullName,
        fullName: res.profile.fullName,
        email: res.user.email,
        phone: res.profile.phoneNumber,
        phoneNumber: res.profile.phoneNumber,
        avatar: res.profile.photoURL,
        rating: res.profile.rating,
        rides: res.profile.totalRides,
        totalRides: res.profile.totalRides,
        verified: true,
        vehicle: res.profile.vehicle,
        isDemo: true
      });
      setRoleState(res.profile.role);
      localStorage.setItem('ridemesh_role', res.profile.role);
      const targetMode = res.profile.activeMode || (res.profile.role === 'driver' ? 'driver' : 'passenger');
      setActiveModeState(targetMode);
      localStorage.setItem('ridemesh_active_mode', targetMode);
      localStorage.setItem('ridemesh_onboarded', 'true');
      setIsGooglePickerOpen(false);
      // Direct navigation to home based on mode
      setCurrentScreen(targetMode === 'driver' ? 22 : 8);
      setHistory([targetMode === 'driver' ? 22 : 8]);
    }
  }, []);

  // Logout action
  const logout = useCallback(async () => {
    await authService.logout();
    localStorage.removeItem('ridemesh_user_session');
    setUser(null);
    setCurrentScreen(5); // Return to Login
    setHistory([5]);
  }, []);

  // Search Parameters
  const [searchParams, setSearchParams] = useState({
    from: 'Pari Chowk, Greater Noida',
    to: 'Noida Sector 62 (Electronic City)',
    date: 'Today',
    time: '09:00 AM',
    passengers: 1
  });

  const recentPlaces = [
    { name: 'Noida Sector 62 (Electronic City)', category: 'Work', subtitle: 'TechZone, Expressway' },
    { name: 'Knowledge Park III, Greater Noida', category: 'College', subtitle: 'Campus Sector' },
    { name: 'DLF Mall of India, Noida Sector 18', category: 'Shopping', subtitle: 'Metro Station Area' },
    { name: 'Botanical Garden Metro Station', category: 'Transit', subtitle: 'Blue / Magenta Line' }
  ];

  const selectDestination = useCallback((place) => {
    setSearchParams(prev => ({ ...prev, to: place }));
    setIsDestinationSearchOpen(false);
  }, []);

  // Filter settings
  const [filters, setFilters] = useState({
    maxDetour: 5,
    maxWalking: 1,
    timePreference: 30,
    acRequired: true,
    musicAllowed: true,
    noSmoking: true,
    femaleDriverPreferred: false
  });

  // AI Matched Rides
  const [matchedRides, setMatchedRides] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const performRideSearch = useCallback(async (params = searchParams) => {
    setIsSearching(true);
    try {
      const results = await aiService.findRideMatches(params, filters);
      setMatchedRides(results);
      if (results.length > 0) {
        setSelectedDriver(results[0]);
      }
    } catch (err) {
      console.warn('[RideMesh] Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [searchParams, filters]);

  // Initial populate of AI matches
  useEffect(() => {
    performRideSearch();
  }, [performRideSearch]);

  const [selectedDriver, setSelectedDriver] = useState(null);

  // Progressive AI Match Finder Trigger
  const triggerAIFindRides = useCallback(async (customParams) => {
    setIsDestinationSearchOpen(false);
    setIsAILoading(true);
    setAiLoadingStep(1); // 1: Finding your best matches...

    await new Promise(r => setTimeout(r, 450));
    setAiLoadingStep(2); // 2: Checking route compatibility...

    await new Promise(r => setTimeout(r, 450));
    setAiLoadingStep(3); // 3: Optimizing pickup points...

    await new Promise(r => setTimeout(r, 450));
    setAiLoadingStep(4); // 4: Calculating the best ride...

    await new Promise(r => setTimeout(r, 400));
    setIsAILoading(false);
    performRideSearch(customParams || searchParams);
    setCurrentScreen(10); // Navigate to AI Matches Screen
    setHistory(prev => [...prev, 10]);
  }, [performRideSearch, searchParams]);

  // Dynamic Pickup Point State
  const [selectedPickup, setSelectedPickup] = useState({
    name: 'Pari Chowk Metro',
    passengerWalk: '600 m',
    driverDetour: '0.3 km',
    timeSaved: '6 min',
    matchScore: 94
  });

  const [pickupOptions] = useState(() => aiService.optimizePickup());

  // Active Ride & Live GPS State
  const [activeRide, setActiveRide] = useState({
    id: 'RM-26491',
    status: RIDE_STATUS.IN_PROGRESS,
    driver: null,
    etaMins: 12,
    distanceKm: 4.8,
    isDeviated: false,
    progress: 35
  });

  // Nearby Available Drivers on Map (Simulation)
  const [nearbyDrivers] = useState([
    { id: 'd1', name: 'Rahul Sharma', rating: 4.8, vehicle: 'Hyundai Creta', eta: '3 min', x: 210, y: 240, seats: 3 },
    { id: 'd2', name: 'Priya Mehta', rating: 4.9, vehicle: 'Tata Nexon EV', eta: '5 min', x: 160, y: 310, seats: 2 },
    { id: 'd3', name: 'Aakash Verma', rating: 4.7, vehicle: 'Maruti Brezza', eta: '6 min', x: 260, y: 190, seats: 3 },
    { id: 'd4', name: 'Sameer Khan', rating: 4.9, vehicle: 'Kia Seltos', eta: '8 min', x: 300, y: 350, seats: 1 }
  ]);

  // Nearby Passenger Pickup Requests (for Driver Mode)
  const [nearbyPassengerRequests] = useState([
    { id: 'p1', name: 'Aakash', rating: 4.9, pickup: 'Pari Chowk Gate 2', drop: 'Noida Sector 62', detour: '0.4 km', fare: 85, matchScore: 95 },
    { id: 'p2', name: 'Sneha', rating: 4.8, pickup: 'Knowledge Park II', drop: 'Botanical Garden', detour: '0.6 km', fare: 75, matchScore: 91 },
    { id: 'p3', name: 'Vikram', rating: 4.7, pickup: 'Alpha 1 Commercial Belt', drop: 'Noida Sec 18', detour: '0.9 km', fare: 90, matchScore: 88 }
  ]);

  // Device Geolocation State
  const [deviceLocation, setDeviceLocation] = useState({
    latitude: 28.4744,
    longitude: 77.5040,
    accuracy: 10,
    permissionGranted: false
  });

  const requestDeviceLocation = useCallback(async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDeviceLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            permissionGranted: true
          });
        },
        (err) => {
          console.warn('[RideMesh Geolocation]:', err.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Real-time Chat Messages
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsub = chatService.subscribeMessages('default_chat', (msgs) => {
      setChatMessages(msgs);
    });
    return () => unsub();
  }, []);

  const sendChatMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const msg = await chatService.sendMessage(
      'default_chat',
      user?.uid || 'passenger',
      activeMode === 'driver' ? 'driver' : 'passenger',
      text
    );
    if (msg) {
      setChatMessages(prev => [...prev, msg]);
    }
  }, [user?.uid, activeMode]);

  // Ride History
  const [rideHistory, setRideHistory] = useState({
    upcoming: [
      {
        id: 101,
        date: 'Tomorrow, 11 Sep',
        route: 'Greater Noida → Noida Sector 62',
        time: '09:00 AM',
        status: 'Confirmed',
        driver: 'Rahul Sharma',
        vehicle: 'Hyundai Creta (UP16AB****)',
        cost: 82
      }
    ],
    completed: [
      {
        id: 102,
        date: '8 Sep',
        route: 'Noida → Delhi Connaught Place',
        time: '06:15 PM',
        cost: 95,
        rating: 5.0,
        driver: 'Aakash Verma'
      },
      {
        id: 103,
        date: '7 Sep',
        route: 'Greater Noida → Noida Sector 18',
        time: '08:45 AM',
        cost: 78,
        rating: 4.8,
        driver: 'Sameer Khan'
      },
      {
        id: 104,
        date: '4 Sep',
        route: 'Noida Sector 62 → Greater Noida Alpha 1',
        time: '07:00 PM',
        cost: 85,
        rating: 4.9,
        driver: 'Priya Mehta'
      }
    ]
  });

  // Sustainability Data
  const [sustainabilityData] = useState(() => sustainabilityService.calculateImpact(24, 480));

  // Driver Dashboard Data
  const [driverData] = useState({
    name: 'Rahul Sharma',
    todayRide: {
      from: 'Greater Noida Alpha 1',
      to: 'Delhi Connaught Place',
      time: '09:00 AM',
      seatsFilled: '3 / 4 seats filled',
      estimatedContribution: 420
    },
    todayEarnings: 420,
    totalPassengers: 4,
    weeklyEarnings: 2480,
    monthlyEarnings: 9850,
    yearlyEarnings: 38400,
    aiSuggestions: '5 passengers are traveling near your route.'
  });

  // Navigation Handlers
  const goToScreen = useCallback((screenNumber) => {
    setHistory(prev => [...prev, screenNumber]);
    setCurrentScreen(screenNumber);
  }, []);

  const goBack = useCallback(() => {
    if (isLocationPickerOpen) {
      setIsLocationPickerOpen(false);
      return;
    }
    if (isLocationPermissionModalOpen) {
      setIsLocationPermissionModalOpen(false);
      return;
    }
    if (isGooglePickerOpen) {
      setIsGooglePickerOpen(false);
      return;
    }
    if (isDestinationSearchOpen) {
      setIsDestinationSearchOpen(false);
      return;
    }
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
      return;
    }

    setHistory(prev => {
      if (prev.length > 1) {
        const nextHistory = [...prev];
        nextHistory.pop();
        const prevScreen = nextHistory[nextHistory.length - 1];
        setCurrentScreen(prevScreen);
        return nextHistory;
      }
      const homeScreen = activeMode === 'driver' ? 22 : 8;
      setCurrentScreen(homeScreen);
      return [homeScreen];
    });
  }, [isLocationPickerOpen, isLocationPermissionModalOpen, isGooglePickerOpen, isDestinationSearchOpen, isNotificationOpen, activeMode]);

  return (
    <RideMeshContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        goToScreen,
        goBack,
        theme,
        toggleTheme,
        role,
        setRole,
        activeMode,
        setActiveMode,
        toggleActiveMode,
        user,
        setUser,
        logout,
        authInitialized,
        isGooglePickerOpen,
        setIsGooglePickerOpen,
        isLocationPickerOpen,
        setIsLocationPickerOpen,
        isLocationPermissionModalOpen,
        setIsLocationPermissionModalOpen,
        hasActiveRide,
        setHasActiveRide,
        confirmedRide,
        setConfirmedRide,
        loginWithDemo,
        demoAccounts: DEMO_ACCOUNTS,
        isDestinationSearchOpen,
        setIsDestinationSearchOpen,
        recentPlaces,
        selectDestination,
        isAILoading,
        setIsAILoading,
        aiLoadingStep,
        triggerAIFindRides,
        isNotificationOpen,
        setIsNotificationOpen,
        searchParams,
        setSearchParams,
        filters,
        setFilters,
        matchedRides,
        isSearching,
        performRideSearch,
        selectedDriver: selectedDriver || matchedRides[0],
        setSelectedDriver,
        selectedPickup,
        setSelectedPickup,
        pickupOptions,
        activeRide,
        setActiveRide,
        nearbyDrivers,
        nearbyPassengerRequests,
        deviceLocation,
        setDeviceLocation,
        requestDeviceLocation,
        chatMessages,
        sendChatMessage,
        rideHistory,
        setRideHistory,
        sustainabilityData,
        driverData
      }}
    >
      {children}
    </RideMeshContext.Provider>
  );
};

export const useRideMesh = () => {
  const context = useContext(RideMeshContext);
  if (!context) {
    throw new Error('useRideMesh must be used within a RideMeshProvider');
  }
  return context;
};
