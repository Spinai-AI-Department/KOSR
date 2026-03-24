import { Link, Outlet, useLocation, Navigate } from "react-router";
import { LayoutGrid, Users, BarChart3, FileText, ClipboardList, LogOut, ChevronRight } from "lucide-react";
import logoImage from "figma:asset/42fc6b12cdf5889f8e5eaaa8a7a3047a4be7c365.png";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: "/", icon: LayoutGrid, label: "대시보드" },
    { path: "/patients", icon: Users, label: "환자 목록" },
    { path: "/surgery-entry", icon: ClipboardList, label: "수술 정보 입력" },
    { path: "/analysis", icon: BarChart3, label: "성과 분석" },
    { path: "/reports", icon: FileText, label: "리포트" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-48 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <img src={logoImage} alt="KOMISS Logo" className="w-24 h-24 mx-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to="/profile"
            className="block mb-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm text-gray-900 truncate">{user?.name}</div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{user?.role}</div>
                <div className="text-xs text-gray-400 truncate">{user?.hospital}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 flex-shrink-0 ml-1" />
            </div>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}