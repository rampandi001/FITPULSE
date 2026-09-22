import { useState } from "react";

import Landing from "./screens/Landing";
import SignIn from "./screens/SignIn";
import Register from "./screens/Register";

import Dashboard from "./screens/Dashboard";
import WorkoutPlans from "./screens/WorkoutPlans";
import Features from "./screens/Features";
import Community from "./screens/Community";
import ExerciseLibrary from "./screens/ExerciseLibrary";
import PlanDetails from "./screens/PlanDetails";
import ExerciseDetails from "./screens/ExerciseDetails";
import Profile from "./screens/Profile";

import WorkoutTracking from "./screens/WorkoutTracking";
import Analytics from "./screens/Analytics";
import Goals from "./screens/Goals";
import Calories from "./screens/Calories";
import WorkoutHistory from "./screens/WorkoutHistory";
import Pricing from "./screens/Pricing";
import Notifications from "./screens/Notifications";
import Settings from "./screens/Settings";
import Support from "./screens/Support";

function App() {
  const [currentScreen, setCurrentScreen] = useState("landing");

  const navigate = (screen) => {
    setCurrentScreen(screen);
  };

  switch (currentScreen) {
    case "landing":
      return <Landing navigate={navigate} />;

    case "signin":
      return <SignIn navigate={navigate} />;

    case "register":
      return <Register navigate={navigate} />;

    case "features":
      return <Features navigate={navigate} />;

    case "community":
      return <Community navigate={navigate} />;

    case "dashboard":
      return <Dashboard navigate={navigate} />;

    case "workout-plans":
      return <WorkoutPlans navigate={navigate} />;

    case "plan-details":
      return <PlanDetails navigate={navigate} />;

    case "exercise-library":
      return <ExerciseLibrary navigate={navigate} />;

    case "exercise-details":
      return <ExerciseDetails navigate={navigate} />;

    case "workout-tracking":
      return <WorkoutTracking navigate={navigate} />;

    case "analytics":
      return <Analytics navigate={navigate} />;

    case "goals":
      return <Goals navigate={navigate} />;

    case "calories":
      return <Calories navigate={navigate} />;

    case "workout-history":
      return <WorkoutHistory navigate={navigate} />;

    case "pricing":
      return <Pricing navigate={navigate} />;

    case "notifications":
      return <Notifications navigate={navigate} />;

    case "profile":
      return <Profile navigate={navigate} />;

    case "settings":
      return <Settings navigate={navigate} />;

    case "support":
      return <Support navigate={navigate} />;

    default:
      return <Landing navigate={navigate} />;
  }
}

export default App;