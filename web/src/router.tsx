import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/common/Layout";
import { Dashboard } from "@/pages/DashboardPage";
import { PatientTracking } from "@/pages/PatientListPage";
import { SurgeryAnalysis } from "@/pages/StatisticsPage";
import { Reports } from "@/pages/ExportPage";
import { SurgeryDataEntry } from "@/pages/PatientNewPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import SurveyWelcomePage from "@/pages/survey/WelcomePage";
import SurveyQuestionsPage from "@/pages/survey/SurveyPage";
import SurveyCompletePage from "@/pages/survey/CompletePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  // Patient survey routes (public, no auth required)
  {
    path: "/patient-survey",
    Component: SurveyWelcomePage,
  },
  {
    path: "/patient-survey/questions",
    Component: SurveyQuestionsPage,
  },
  {
    path: "/patient-survey/complete",
    Component: SurveyCompletePage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: PatientTracking },
      { path: "analysis", Component: SurgeryAnalysis },
      { path: "reports", Component: Reports },
      { path: "surgery-entry", Component: SurgeryDataEntry },
      { path: "profile", Component: ProfilePage },
      { path: "admin/users", Component: AdminUsersPage },
    ],
  },
]);