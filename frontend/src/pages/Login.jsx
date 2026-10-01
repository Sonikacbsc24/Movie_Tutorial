import { Component } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/Login.css";

// CLASS COMPONENT: LoginForm
// Demonstrates class-based state, controlled inputs, event handling, and validation.
class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "login",
      username: "",
      password: "",
      confirmPassword: "",
      errors: {},
      formError: "",
      submitting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleMode = this.toggleMode.bind(this);
  }

  toggleMode() {
    this.setState((prev) => ({
      mode: prev.mode === "login" ? "register" : "login",
      errors: {},
      formError: "",
      confirmPassword: "",
    }));
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState((prev) => ({
      [name]: value,
      formError: "",
      errors: { ...prev.errors, [name]: "" },
    }));
  }

  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  validate() {
    const { username, password, confirmPassword, mode } = this.state;
    const errors = {};
    const identifier = username.trim();

    if (!identifier) {
      errors.username = "Username or email is required.";
    } else if (identifier.includes("@")) {
      if (!this.isEmail(identifier)) {
        errors.username = "Enter a valid email address.";
      }
    } else if (identifier.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (mode === "register") {
      if (!confirmPassword) {
        errors.confirmPassword = "Confirm your password.";
      } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validate()) {
      this.setState({ formError: "Please fix the errors above and try again." });
      return;
    }

    this.setState({ submitting: true, formError: "" });
    const credentials = {
      username: this.state.username.trim(),
      password: this.state.password,
    };

    try {
      if (this.state.mode === "register") {
        await this.props.onRegister(credentials);
      } else {
        await this.props.onLogin(credentials);
      }
    } catch (error) {
      this.setState({
        formError: error.message || "Request failed. Is the backend running?",
        submitting: false,
      });
      return;
    }

    this.setState({ submitting: false });
  }

  render() {
    const {
      mode,
      username,
      password,
      confirmPassword,
      errors,
      formError,
      submitting,
    } = this.state;
    const isRegister = mode === "register";

    return (
      <div className="login-page">
        <div className="login-card">
          <h1>{isRegister ? "Create account" : "Sign in"}</h1>
          <p className="login-subtitle">
            {isRegister
              ? "New users are saved on the server with a password."
              : "Log in with an existing account. Passwords are checked on the API."}
          </p>

          <form className="login-form" onSubmit={this.handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Username / Email</label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={this.handleChange}
                className={errors.username ? "invalid" : ""}
                placeholder="you@example.com or username"
                autoComplete="username"
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={this.handleChange}
                className={errors.password ? "invalid" : ""}
                placeholder="At least 6 characters"
                autoComplete={isRegister ? "new-password" : "current-password"}
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            {isRegister && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.handleChange}
                  className={errors.confirmPassword ? "invalid" : ""}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>
            )}

            {formError && <div className="form-error">{formError}</div>}

            <button type="submit" className="login-button" disabled={submitting}>
              {submitting
                ? isRegister
                  ? "Creating account..."
                  : "Signing in..."
                : isRegister
                  ? "Create account"
                  : "Login"}
            </button>
          </form>

          <button type="button" className="mode-toggle" onClick={this.toggleMode}>
            {isRegister
              ? "Already have an account? Log in"
              : "New here? Create an account"}
          </button>
        </div>
      </div>
    );
  }
}

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const afterAuth = async (action, credentials) => {
    await action(credentials);
    navigate("/");
  };

  return (
    <LoginForm
      onLogin={(credentials) => afterAuth(login, credentials)}
      onRegister={(credentials) => afterAuth(register, credentials)}
    />
  );
}

export default Login;
