"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Header from "./components/Header";
import Footer from "./components/Footer";
import {
  Input,
  Button,
  Form,
  Radio,
  message,
} from 'antd';

// Define user credentials (in a real app, this would come from a backend)
const users = {
  leo: { password: "leo123", role: "LEO" },
  analyst: { password: "analyst123", role: "Analyst" },
  judiciary: { password: "judiciary123", role: "Judiciary" }
};

const styles = `
  .login-button:hover {
    background: #555 !important;
  }
  .login-button {
    position: relative;
    overflow: hidden;
  }
  .login-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: 0.5s;
  }
  .login-button:hover::after {
    left: 100%;
  }

  .ant-radio-button-wrapper-checked {
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
    background: rgba(255, 255, 255, 0.1) !important;
    transition: all 0.3s ease;
  }

  .ant-radio-button-wrapper {
    transition: all 0.3s ease !important;
  }

  .ant-radio-button-wrapper:hover {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.2) !important;
    background: rgba(255, 255, 255, 0.05) !important;
  }
`;

export default function Home() {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const { username, password, role } = values;
    
    // Check if user exists and credentials match
    const user = users[username as keyof typeof users];
    if (user && user.password === password && user.role === role) {
      // Clear any existing auth data
      localStorage.clear();
      
      // Store user info in localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      console.log('Stored role:', role);
      console.log('Stored username:', username);

      // Redirect based on role
      switch (role) {
        case 'LEO':
          router.push('/LEO/uploadevidence');
          break;
        case 'Analyst':
          router.push('/forensics/caseDetails');
          break;
        case 'Judiciary':
          router.push('/judicialauth/viewEvidence');
          break;
        default:
          message.error('Invalid role');
      }
    } else {
      message.error('Invalid credentials or role mismatch');
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(to bottom, #000000, #1a1a1a)"
    }}>
      <div style={{ 
        flex: 1,
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        padding: "2rem"
      }}>
        <div style={{
          maxWidth: "400px",
          width: "100%",
          textAlign: "center"
        }}>
          <h1 style={{ 
            color: "#fff", 
            marginBottom: "2rem",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "0 0 10px rgba(255,255,255,0.2)"
          }}>
            Enter the Details
          </h1>
          <Form
            form={form}
            onFinish={handleSubmit}
            initialValues={{ role: 'LEO' }}
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              padding: "2rem",
              borderRadius: "15px",
              color: "#fff",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
            layout="vertical"
          >
            <Form.Item
              label={<span style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }}>Username</span>}
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input 
                size="large"
                style={{ 
                  background: "#222", 
                  color: "#fff", 
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "12px"
                }} 
              />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }}>Password</span>}
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password 
                size="large"
                style={{ 
                  background: "#222", 
                  color: "#fff", 
                  border: "1px solid #444",
                  borderRadius: "8px"
                }} 
              />
            </Form.Item>

            <Form.Item 
              name="role" 
              label={<span style={{ color: "#fff", fontSize: "16px", fontWeight: "500" }}>Select Role</span>}
              rules={[{ required: true, message: 'Please pick a Role' }]}
            >
              <Radio.Group style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <Radio.Button value="LEO" style={{ 
                  background: 'rgba(34, 34, 34, 0.8)', 
                  color: "#fff", 
                  borderColor: '#444',
                  minWidth: "100px",
                  textAlign: "center",
                  position: "relative",
                  zIndex: "1"
                }}>LEO</Radio.Button>
                <Radio.Button value="Analyst" style={{ 
                  background: 'rgba(34, 34, 34, 0.8)', 
                  color: "#fff", 
                  borderColor: '#444',
                  minWidth: "100px",
                  textAlign: "center",
                  position: "relative",
                  zIndex: "1"
                }}>Analyst</Radio.Button>
                <Radio.Button value="Judiciary" style={{ 
                  background: 'rgba(34, 34, 34, 0.8)', 
                  color: "#fff", 
                  borderColor: '#444',
                  minWidth: "100px",
                  textAlign: "center",
                  position: "relative",
                  zIndex: "1"
                }}>Judiciary</Radio.Button>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item style={{ marginTop: "2rem" }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                className="login-button"
                style={{ 
                  background: "#444", 
                  border: "none", 
                  width: "100%",
                  height: "48px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer projectName="BCOC" style={{
        fontSize: "0.8rem",
        padding: "0.5rem",
        opacity: "0.7",
        background: "transparent",
        position: "fixed",
        bottom: "0",
        width: "100%",
        textAlign: "center"
      }} />
      <style>{styles}</style>
    </div>
  );
}