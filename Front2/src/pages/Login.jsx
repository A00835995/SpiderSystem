import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUI5Theme } from "../components/UI5ThemeProvider";
import {
  Card,
  Form,
  FormItem,
  Input,
  Button,
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  Title,
  Text,
  Icon,
  Link,
  FormGroup,
  MessageStrip,
  IllustratedMessage,
  IllustrationMessageType,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/log.js";
import "@ui5/webcomponents-icons/dist/message-information.js";
import "@ui5/webcomponents-icons/dist/email.js";
import "@ui5/webcomponents-icons/dist/key.js";
import "@ui5/webcomponents-icons/dist/show.js";
import "@ui5/webcomponents-icons/dist/hide.js";
import "@ui5/webcomponents-fiori/dist/illustrations/AllIllustrations.js";
import { AuthImagePattern } from "../components/AuthImagePattern";

// Rutas de los logos según el modo
const LOGO_LIGHT = "/logo-dark.png"; // Logo negro para modo claro (fondo claro)
const LOGO_DARK = "/logo-light.png"; // Logo blanco para modo oscuro (fondo oscuro)

export default function Login() {
  const navigate = useNavigate();
  const { isDarkMode } = useUI5Theme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Determinar qué logo usar según el modo
  const logoToUse = isDarkMode ? LOGO_DARK : LOGO_LIGHT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // limpia error anterior
  
    if (!formData.email || !formData.password) {
      setError("Por favor complete todos los campos");
      return;
    }
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.message || "Error en el servidor");
        return;
      }
  
      // Guarda el token (puedes usar localStorage o context)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log(localStorage.getItem("token"));
      console.log(localStorage.getItem("user"));
      console.log(JSON.parse(localStorage.getItem("user")).name);

      // Redirecciona al dashboard
      navigate("/home");
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar al servidor");
    }
  };  

  const leftPanelStyle = {
    position: "relative",
    backgroundColor: isDarkMode ? "var(--sapBackgroundColor)" : "var(--sapBackgroundColor)",
    color: isDarkMode ? "var(--sapContent_ContrastTextColor)" : "var(--sapTextColor)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100vh",
    width: "50%",
    padding: "2rem",
  };

  const rightPanelStyle = {
    backgroundColor: isDarkMode ? "#1e2a4a" : "#f0f4f8",
    color: isDarkMode ? "#e2e8f0" : "#475569",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "50%",
    position: "relative",
    overflow: "hidden",
  };

  // Estilo para el fondo con gradiente del panel derecho
  const rightPanelBackgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: isDarkMode ? "rgba(26, 32, 54, 0.7)" : "rgba(0, 0, 0, 0.05)",
    zIndex: 1
  };

  const inputContainerStyle = {
    position: "relative",
    marginBottom: "1.5rem",
    width: "100%",
  };

  const inputStyle = {
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
    backgroundColor: isDarkMode ? "rgba(66, 153, 225, 0.1)" : "rgba(66, 153, 225, 0.05)",
    border: isDarkMode ? "1px solid #4a5568" : "1px solid #e2e6f0",
    height: "3rem",
    fontSize: "0.95rem",
    width: "100%",
  };

  const buttonStyle = {
    width: "100%",
    borderRadius: "8px",
    fontWeight: 600,
    transition: "all 0.3s ease",
    backgroundColor: isDarkMode ? "#4299e1" : "#3182ce",
    color: "white",
    marginTop: "1.5rem",
    height: "3rem",
    fontSize: "1rem",
    border: "none",
    boxShadow: "0 4px 6px rgba(66, 153, 225, 0.2)",
  };


  const createAccountStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2rem",
    width: "100%",
  };

  const logoContainerStyle = {
    width: "30rem",
    height: "30rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1rem",
    position: "relative",
    zIndex: 5
  };

  const logoStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  };

  return (
    <FlexBox 
      style={{ 
        height: "100vh", 
        width: "100vw",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        margin: 0,
        padding: 0,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Panel izquierdo - Formulario de Login */}
      <div style={leftPanelStyle}>
        <div style={{ 
          width: "100%", 
          maxWidth: "400px", 
          margin: "0 auto", 
          padding: "0 2rem"
        }}>
          {/* Título sin logo */}
          <FlexBox
            direction={FlexBoxDirection.Column}
            alignItems={FlexBoxAlignItems.Center}
            style={{ marginBottom: "2.5rem", textAlign: "center" }}
          >
            <Title level="H1" style={{ marginBottom: "0.75rem", fontSize: "1.75rem" }}>
              Bienvenido de Nuevo
            </Title>
            <Text style={{ 
              color: isDarkMode ? "var(--sapNeutralTextColor)" : "var(--sapNeutralTextColor)",
              fontSize: "0.95rem"
            }}>
              Inicia sesión en tu cuenta
            </Text>
          </FlexBox>

          {error && (
            <MessageStrip
              design="Negative"
              icon="message-error"
              onClose={() => setError("")}
              style={{ marginBottom: "1.5rem", borderRadius: "8px" }}
            >
              {error}
            </MessageStrip>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div style={inputContainerStyle}>
              <Text style={{ 
                marginBottom: "0.5rem", 
                fontSize: "0.875rem", 
                fontWeight: "500", 
                display: "block"
              }}>
                Correo Electrónico
              </Text>
              <Input
                type="Email"
                icon="email"
                placeholder="usuario@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
            
            <div style={inputContainerStyle}>
              <Text style={{ 
                marginBottom: "0.5rem", 
                fontSize: "0.875rem", 
                fontWeight: "500", 
                display: "block"
              }}>
                Contraseña
              </Text>
              <Input
                type={showPassword ? "Text" : "Password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onIconClick={() => setShowPassword(!showPassword)}
                icon={showPassword ? "hide" : "show"}
                required
                style={inputStyle}
              />
            </div>
            
            <Button 
              design="Emphasized"
              style={buttonStyle}
              onClick={handleSubmit}
            >
              Iniciar Sesión
            </Button>
            
            <div style={createAccountStyle}>
              <Text style={{ color: isDarkMode ? "#a0aec0" : "#718096", marginRight: "0.5rem" }}>
                ¿No tienes una cuenta?
              </Text>
              <Link 
                onClick={() => navigate("/home")}
                style={{ 
                  color: isDarkMode ? "#4299e1" : "#3182ce", 
                  fontWeight: "500"
                }}
              >
                Crear cuenta
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Panel derecho - Texto y gráficos */}
      <div style={rightPanelStyle}>
        <AuthImagePattern />
        <div style={rightPanelBackgroundStyle}></div>
        
        <FlexBox
          direction={FlexBoxDirection.Column}
          justifyContent={FlexBoxJustifyContent.Center}
          alignItems={FlexBoxAlignItems.Center}
          style={{ 
            height: "100%",
            width: "100%",
            padding: "4rem 2rem",
            textAlign: "center",
            zIndex: 2,
            position: "relative"
          }}
        >
          {/* Logo grande */}
          <div style={logoContainerStyle}>
            <img 
              src={logoToUse} 
              alt="Logo del Sistema" 
              style={logoStyle}
              onError={(e) => {
                // Fallback a un icono si la imagen no carga
                e.target.style.display = 'none';
                const fallbackContainer = e.target.parentNode;
                
                // Crear elemento de icono
                const iconElement = document.createElement('div');
                iconElement.style.width = '100%';
                iconElement.style.height = '100%';
                iconElement.style.display = 'flex';
                iconElement.style.alignItems = 'center';
                iconElement.style.justifyContent = 'center';
                iconElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                iconElement.style.borderRadius = '50%';
                
                iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="100px" height="100px"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/></svg>';
                fallbackContainer.appendChild(iconElement);
              }}
            />
          </div>
          
          {/* Texto de bienvenida */}
          <div>
            <Title level="H1" style={{ 
              fontSize: "2.5rem", 
              marginBottom: "1rem", 
              color: isDarkMode ? "white" : "#1e2a4a",
              textShadow: isDarkMode ? "none" : "0 1px 2px rgba(0, 0, 0, 0.05)"
            }}>
              ¡Bienvenido de nuevo!
            </Title>
            <Text style={{ 
              fontSize: "1.25rem", 
              maxWidth: "80%", 
              margin: "0 auto", 
              color: isDarkMode ? "#cbd5e0" : "#334155",
              lineHeight: "1.6",
              textShadow: isDarkMode ? "none" : "0 1px 2px rgba(0, 0, 0, 0.03)"
            }}>
              Inicia sesión para continuar tus conversaciones y ponerte al día con tus mensajes.
            </Text>
          </div>
        </FlexBox>
      </div>
    </FlexBox>
  );
} 