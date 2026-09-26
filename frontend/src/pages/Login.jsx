import { Component } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/Login.css";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errors: {},
      formError: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { username, password } = this.state;
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

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validate()) {
      this.setState({ formError: "Please fix the errors above and try again." });
      return;
    }

    const identifier = this.state.username.trim();
    this.props.onLogin({
      username: identifier,
      loggedInAt: new Date().toISOString(),
    });
  }

  render() {
    const { username, password, errors, formError } = this.state;

    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Sign in</h1>
          <p className="login-subtitle">
            Class component login with form handling, events, and validation.
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
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            {formError && <div className="form-error">{formError}</div>}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <p className="login-hint">
            Demo login: any valid username/email and a password of 6+ characters.
          </p>
        </div>
      </div>
    );
  }
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (user) => {
    login(user);
    navigate("/");
  };

  return <LoginForm onLogin={handleLogin} />;
}

export default Login;
