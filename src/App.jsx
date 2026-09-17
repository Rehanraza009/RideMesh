// ==============================================================================
// RIDEMESH PRODUCTION ANDROID APPLICATION
// Match Smarter. Ride Together.
// ==============================================================================
import React, { useEffect } from 'react';
import { RideMeshProvider, useRideMesh } from './context/RideMeshContext';
import { App as CapApp } from '@capacitor/app';

// Application Screens
import { Screen1_Splash } from './components/screens/Screen1_Splash';
import { Screen2_Onboarding1 } from './components/screens/Screen2_Onboarding1';
import { Screen3_Onboarding2 } from './components/screens/Screen3_Onboarding2';
import { Screen4_Onboarding3 } from './components/screens/Screen4_Onboarding3';
import { Screen5_Login } from './components/screens/Screen5_Login';
import { Screen6_Signup } from './components/screens/Screen6_Signup';
import { Screen7_ChooseRole } from './components/screens/Screen7_ChooseRole';
import { Screen8_HomePassenger } from './components/screens/Screen8_HomePassenger';
import { Screen9_SearchFilters } from './components/screens/Screen9_SearchFilters';
import { Screen10_RideResults } from './components/screens/Screen10_RideResults';
import { Screen11_DriverDetails } from './components/screens/Screen11_DriverDetails';
import { Screen12_PickupPointMap } from './components/screens/Screen12_PickupPointMap';
import { Screen13_ConfirmRequest } from './components/screens/Screen13_ConfirmRequest';
import { Screen14_RequestReceived } from './components/screens/Screen14_RequestReceived';
import { Screen15_ActiveRideTracking } from './components/screens/Screen15_ActiveRideTracking';
import { Screen16_RouteDeviationAlert } from './components/screens/Screen16_RouteDeviationAlert';
import { Screen17_EmergencySOS } from './components/screens/Screen17_EmergencySOS';
import { Screen18_Chat } from './components/screens/Screen18_Chat';
import { Screen19_RideCompleted } from './components/screens/Screen19_RideCompleted';
import { Screen20_RatingScreen } from './components/screens/Screen20_RatingScreen';
import { Screen21_RideHistory } from './components/screens/Screen21_RideHistory';
import { Screen22_DriverDashboard } from './components/screens/Screen22_DriverDashboard';
import { Screen23_CreateRide } from './components/screens/Screen23_CreateRide';
import { Screen24_AIInsights } from './components/screens/Screen24_AIInsights';
import { Screen25_SustainabilityDashboard } from './components/screens/Screen25_SustainabilityDashboard';
import { Screen26_Profile } from './components/screens/Screen26_Profile';
import { Screen27_Settings } from './components/screens/Screen27_Settings';

// Overlays & Sheets
import { NotificationCenter } from './components/common/NotificationCenter';
import { GoogleAccountPickerModal } from './components/common/GoogleAccountPickerModal';
import { DestinationSearchSheet } from './components/common/DestinationSearchSheet';
import { LocationPickerModal } from './components/common/LocationPickerModal';
import { LocationPermissionModal } from './components/common/LocationPermissionModal';
import { AIMatchingLoader } from './components/common/AIMatchingLoader';

const SCREEN_COMPONENTS = {
  1: Screen1_Splash,
  2: Screen2_Onboarding1,
  3: Screen3_Onboarding2,
  4: Screen4_Onboarding3,
  5: Screen5_Login,
  6: Screen6_Signup,
  7: Screen7_ChooseRole,
  8: Screen8_HomePassenger,
  9: Screen9_SearchFilters,
  10: Screen10_RideResults,
  11: Screen11_DriverDetails,
  12: Screen12_PickupPointMap,
  13: Screen13_ConfirmRequest,
  14: Screen14_RequestReceived,
  15: Screen15_ActiveRideTracking,
  16: Screen16_RouteDeviationAlert,
  17: Screen17_EmergencySOS,
  18: Screen18_Chat,
  19: Screen19_RideCompleted,
  20: Screen20_RatingScreen,
  21: Screen21_RideHistory,
  22: Screen22_DriverDashboard,
  23: Screen23_CreateRide,
  24: Screen24_AIInsights,
  25: Screen25_SustainabilityDashboard,
  26: Screen26_Profile,
  27: Screen27_Settings
};

const MobileAppViewport = () => {
  const {
    currentScreen,
    goToScreen,
    goBack,
    role,
    activeMode,
    user,
    authInitialized,
    isNotificationOpen,
    setIsNotificationOpen
  } = useRideMesh();

  // Authentication Route Guard
  useEffect(() => {
    if (!authInitialized) return;

    const hasOnboarded = localStorage.getItem('ridemesh_onboarded') === 'true';
    const isAuthenticated = Boolean(user && user.uid);

    // If not authenticated, ensure user cannot remain on protected screens (7-27)
    if (!isAuthenticated && currentScreen >= 7) {
      if (!hasOnboarded) {
        goToScreen(2); // Onboarding 1
      } else {
        goToScreen(5); // Login Screen
      }
    }
  }, [authInitialized, user, currentScreen, goToScreen]);

  // Android Hardware Back Button Listener (Capacitor)
  useEffect(() => {
    let listenerHandler = null;

    const setupBackHandler = async () => {
      try {
        listenerHandler = await CapApp.addListener('backButton', () => {
          if (isNotificationOpen) {
            setIsNotificationOpen(false);
          } else if (currentScreen === 8 || currentScreen === 22) {
            // If on main home screen, minimize app
            CapApp.minimizeApp().catch(() => {});
          } else {
            goBack();
          }
        });
      } catch {
        // Fallback for desktop browser development
      }
    };

    setupBackHandler();

    return () => {
      if (listenerHandler && typeof listenerHandler.remove === 'function') {
        listenerHandler.remove();
      }
    };
  }, [currentScreen, isNotificationOpen, goBack, setIsNotificationOpen]);

  // Route guard fallback for initial render before useEffect runs:
  const isAuthenticated = Boolean(user && user.uid);
  let ActiveScreen = SCREEN_COMPONENTS[currentScreen];

  if (!authInitialized) {
    ActiveScreen = Screen1_Splash;
  } else if (!isAuthenticated && currentScreen >= 7) {
    const hasOnboarded = localStorage.getItem('ridemesh_onboarded') === 'true';
    ActiveScreen = hasOnboarded ? Screen5_Login : Screen2_Onboarding1;
  } else if (!ActiveScreen) {
    ActiveScreen = isAuthenticated
      ? (activeMode === 'driver' ? Screen22_DriverDashboard : Screen8_HomePassenger)
      : Screen1_Splash;
  }

  return (
    <div className="rm-app-container">
      {/* Main Full-Screen Mobile Viewport */}
      <main className="rm-app-viewport" id="rm-main-viewport">
        <ActiveScreen />
      </main>

      {/* Slide-up In-App Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Demo Google Account Picker Bottom Sheet */}
      <GoogleAccountPickerModal />

      {/* Destination Search Bottom Sheet */}
      <DestinationSearchSheet />

      {/* Location Pickup Picker Modal */}
      <LocationPickerModal />

      {/* Location Permission & Demo Geolocation Modal */}
      <LocationPermissionModal />

      {/* AI Smart Matching Step-by-Step Animated Loader */}
      <AIMatchingLoader />
    </div>
  );
};

export default function App() {
  return (
    <RideMeshProvider>
      <MobileAppViewport />
    </RideMeshProvider>
  );
}
