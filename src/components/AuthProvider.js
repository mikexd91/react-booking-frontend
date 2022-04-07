import { useState, createContext, useContext } from "react";
import { Menu } from "@headlessui/react";
import styled from "styled-components";
import { useLocation, Navigate, Link } from "react-router-dom";

const Span = styled.span`
  color: white;
  padding: 0 15px 0 10px;
`;

const navigation = [{ name: "Room", href: "/room", current: true }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const { REACT_APP_URL } = process.env;

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setAuthentication] = useState(
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState({
    name: "",
    email: "user@gmail.com",
    imageUrl:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  });

  const signin = async (body) => {
    const response = await fetch(`${REACT_APP_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      const payload = parseJwt(data.accessToken);
      setUser({
        name: payload.username,
        email: user.email,
        imageUrl: user.imageUrl,
      });
      localStorage.setItem("access_token", data.accessToken);
      setAuthentication(data.accessToken);
    } else {
      if (response.status == 401) {
        localStorage.removeItem("access_token");
      }
    }
  };

  const signup = async (body, callback) => {
    const response = await fetch(`${REACT_APP_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.accessToken);
      setAuthentication(data.accessToken);
      callback();
    } else {
      if (response.status == 401) {
        localStorage.removeItem("access_token");
      }
    }
    callback(response);
  };

  const signout = (callback) => {
    setAuthentication(false);
    callback();
  };

  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const value = { isAuthenticated, signin, signup, signout };

  return (
    <AuthContext.Provider value={value}>
      <div className="min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                  alt="Workflow"
                />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <Link to={item.href} key={item.name}>
                      <a
                        key={item.name}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {isAuthenticated && (
              <Link to="/profile">
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile */}
                    <Menu as="div" className="ml-3 relative">
                      <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                        <Span>{user.name}</Span>
                      </Menu.Button>
                    </Menu>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export { useAuth, AuthProvider, RequireAuth };
