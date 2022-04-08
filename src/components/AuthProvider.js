import { useState, createContext, useContext, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [user, setUser] = useState({
    name: "",
    email: "user@gmail.com",
    imageUrl:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  });

  useEffect(() => {
    localStorage.getItem("access_token") &&
      setName(parseJwt(localStorage.getItem("access_token")).username);
  }, []);

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
      return data;
    } else {
      const data = await response.json();
      return data;
    }
  };

  const signup = async (body) => {
    const response = await fetch(`${REACT_APP_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setAuthentication(false);
      const data = await response.json();
      return data;
    }
  };

  const signout = () => {
    setAuthentication(false);
    localStorage.removeItem("access_token");
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
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {/* Profile */}
                  <Link to="/profile">
                    <Menu as="div" className="ml-3 relative">
                      <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-800 hover:ring-white">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                        <Span>{user.name || name}</Span>
                      </Menu.Button>
                    </Menu>
                  </Link>
                  <div
                    className="max-w-xs flex items-center text-sm hover:text-gray-500 ml-3 relative"
                    onClick={signout}
                  >
                    Logout
                  </div>
                </div>
              </div>
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
