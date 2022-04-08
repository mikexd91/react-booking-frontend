import { useState, useEffect } from "react";
import { LockClosedIcon, XIcon } from "@heroicons/react/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import OverlaySpinner from "../components/OverlaySpinner";
import OrganisationGallery from "../components/OrganisationGallery";

const { REACT_APP_URL } = process.env;

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organisations, setOrganisation] = useState([]);
  const [selectedOrganisation, setSelectOrganisation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [signUpError, setSignupErrorMessage] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || "/room";

  const handleLogin = async () => {
    setLoading(true);
    const result = await auth.signin({ username, password });
    if (result.accessToken) {
      navigate(from, { replace: true });
    } else {
      if (result.statusCode === 400) {
        setSignupErrorMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    const result = await auth.signup({
      username,
      password,
      organisation: selectedOrganisation,
    });
    if (!result) {
      setIsLogin(true);
      setSignupErrorMessage([]);
      setErrorMessage("");
    } else {
      if (result.statusCode === 400) {
        setSignupErrorMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchOrganisations = async () => {
      const response = await fetch(`${REACT_APP_URL}/organisations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setErrorMessage(response.message);
      }

      const data = await response.json();
      setOrganisation(data);
      setLoading(false);
    };
    fetchOrganisations();
  }, []);

  const onSelectProduct = (product) => {
    setSelectOrganisation(product.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  return (
    <>
      <OverlaySpinner isLoading={loading}></OverlaySpinner>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />

            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin
                ? "Sign in to your account"
                : "Sign up with your organisation"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <a
                href="#"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage("");
                  setSignupErrorMessage([]);
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {!isLogin
                  ? "Sign in to your account"
                  : "Sign up with your organisation"}
              </a>
            </p>
          </div>
          <form
            className="mt-8 space-y-6"
            action="#"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {!isLogin && (
                <OrganisationGallery
                  products={organisations}
                  onSelectProduct={onSelectProduct}
                ></OrganisationGallery>
              )}
            </div>
            {errorMessage && (
              <div className="flex flex-row">
                <XIcon className="h-5 w-5 text-red-500 group-hover:text-red-400"></XIcon>
                <div className="px-2">{errorMessage}</div>
              </div>
            )}
            {signUpError.map((item) => (
              <div key={item} className="flex flex-row">
                <XIcon className="h-5 w-5 text-red-500 group-hover:text-red-400"></XIcon>
                <div className="px-2">{item}</div>
              </div>
            ))}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                {isLogin ? "Sign in" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
