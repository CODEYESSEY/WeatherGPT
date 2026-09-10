"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [toast, setToast] = useState<string>("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("Logged in successfully! Redirecting to dashboard...");
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setToast("Account created successfully! Welcome to WeatherGPT.");
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#090B10",
        color: "#FFFFFF",
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Bar Navigation */}
      <div
        style={{
          padding: "1.25rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#FFF",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
            }}
          >
            <i className="fa-solid fa-bolt-lightning"></i>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 700 }}>
            Weather<span style={{ color: "#818CF8" }}>GPT</span>
          </span>
        </Link>

        <Link
          href="/"
          style={{
            color: "#94A3B8",
            textDecoration: "none",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: 8,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      {/* Main Container */}
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          width: "100%",
          padding: "1.5rem 2rem",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: "3.5rem",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* Left Column */}
        <section>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: "1rem",
            }}
          >
            AI-Powered Weather Intelligence
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #A78BFA, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              for a Safer, Smarter Tomorrow
            </span>
          </h2>

          <p
            style={{
              color: "#9CA3AF",
              fontSize: "1rem",
              lineHeight: 1.6,
              marginBottom: "2.5rem",
            }}
          >
            Get real-time weather updates, early warnings, agricultural advisories, disaster alerts, and smart decision support — all with Gemini & Groq multi-model AI.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
              marginBottom: "2.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818CF8",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                <i className="fa-regular fa-comment-dots"></i>
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#F3F4F6", marginBottom: 2 }}>
                  AI Weather Assistant
                </h4>
                <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>Ask anything in natural language or voice</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818CF8",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#F3F4F6", marginBottom: 2 }}>
                  Interactive Radar
                </h4>
                <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>Live radar, satellite, precipitation & hazards</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818CF8",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-leaf"></i>
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#F3F4F6", marginBottom: 2 }}>
                  Agricultural Advisory
                </h4>
                <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>Crop & irrigation farming guidance</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#818CF8",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#F3F4F6", marginBottom: 2 }}>
                  Trusted Accuracy
                </h4>
                <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>Official IMD, ECMWF & GFS models</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column Auth Card */}
        <section
          style={{
            background: "rgba(18, 22, 33, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: 20,
            padding: "2.5rem",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={() => setTab("login")}
              style={{
                flex: 1,
                padding: "0.75rem 0",
                background: "none",
                border: "none",
                color: tab === "login" ? "#FFF" : "#9CA3AF",
                fontSize: "1rem",
                fontWeight: tab === "login" ? 600 : 500,
                cursor: "pointer",
                borderBottom: tab === "login" ? "2px solid #3B82F6" : "2px solid transparent",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setTab("signup")}
              style={{
                flex: 1,
                padding: "0.75rem 0",
                background: "none",
                border: "none",
                color: tab === "signup" ? "#FFF" : "#9CA3AF",
                fontSize: "1rem",
                fontWeight: tab === "signup" ? 600 : 500,
                cursor: "pointer",
                borderBottom: tab === "signup" ? "2px solid #3B82F6" : "2px solid transparent",
              }}
            >
              Sign Up
            </button>
          </div>

          {tab === "login" ? (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 4 }}>Welcome back! 👋</h2>
                <p style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
                  Login to access personalized climate intelligence.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#D1D5DB", marginBottom: 6 }}>
                    Email or Phone
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-regular fa-envelope"
                      style={{ position: "absolute", left: 16, color: "#6B7280", fontSize: "0.9rem" }}
                    ></i>
                    <input
                      type="text"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem 0.85rem 2.75rem",
                        background: "rgba(15, 20, 30, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#D1D5DB", marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-lock"
                      style={{ position: "absolute", left: 16, color: "#6B7280", fontSize: "0.9rem" }}
                    ></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 2.75rem 0.85rem 2.75rem",
                        background: "rgba(15, 20, 30, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                    <i
                      className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 16,
                        color: "#6B7280",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    ></i>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: "linear-gradient(90deg, #4F46E5, #3B82F6)",
                    border: "none",
                    borderRadius: 10,
                    color: "#FFF",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: "1.5rem",
                  }}
                >
                  Login to WeatherGPT <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 4 }}>Get Started Free! ⚡</h2>
                <p style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>
                  Create your account for personalized climate intelligence.
                </p>
              </div>

              <form onSubmit={handleSignup}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#D1D5DB", marginBottom: 6 }}>
                    Full Name
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-regular fa-user"
                      style={{ position: "absolute", left: 16, color: "#6B7280", fontSize: "0.9rem" }}
                    ></i>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem 0.85rem 2.75rem",
                        background: "rgba(15, 20, 30, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#D1D5DB", marginBottom: 6 }}>
                    Email Address
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-regular fa-envelope"
                      style={{ position: "absolute", left: 16, color: "#6B7280", fontSize: "0.9rem" }}
                    ></i>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 1rem 0.85rem 2.75rem",
                        background: "rgba(15, 20, 30, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.85rem", color: "#D1D5DB", marginBottom: 6 }}>
                    Password
                  </label>
                  <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-lock"
                      style={{ position: "absolute", left: 16, color: "#6B7280", fontSize: "0.9rem" }}
                    ></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.85rem 2.75rem 0.85rem 2.75rem",
                        background: "rgba(15, 20, 30, 0.6)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: 10,
                        color: "#FFF",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                    <i
                      className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 16,
                        color: "#6B7280",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    ></i>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: "linear-gradient(90deg, #4F46E5, #3B82F6)",
                    border: "none",
                    borderRadius: 10,
                    color: "#FFF",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginTop: "1.5rem",
                  }}
                >
                  Create Your Account <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
          )}
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div className="toast active" style={{ zIndex: 9999 }}>
          {toast}
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", textAlign: "center", fontSize: "0.8rem", color: "#6B7280" }}>
          © 2026 WeatherGPT. Enterprise-grade climate & weather decision intelligence.
        </div>
      </footer>
    </div>
  );
}
