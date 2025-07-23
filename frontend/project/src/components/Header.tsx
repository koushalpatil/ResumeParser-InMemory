import { Link, useLocation } from "react-router-dom";
import { Brain, ChevronRight } from "lucide-react";

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:shadow-lg transition-all duration-300">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SmartResumeAI
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/upload"
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === "/upload"
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Upload
            </Link>
            <Link
              to="/upload"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-1"
            >
              <span>Get Started</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
