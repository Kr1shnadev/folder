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
    <>
      <Header title="Login" />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Form
          form={form}
          onFinish={handleSubmit}
          initialValues={{ role: 'LEO' }}
          style={{
            background: "#000",
            padding: "20px",
            borderRadius: "8px",
            color: "#fff",
            maxWidth: "800px",
            width: "100%",
            boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.1)"
          }}
        >
          <Form.Item
            label={<span style={{ color: "#fff", fontSize: "20px" }}>Username</span>}
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff", fontSize: "20px" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password style={{ background: "#222", color: "#fff", border: "1px solid #444" }} />
          </Form.Item>

          <Form.Item 
            name="role" 
            label={<span style={{ color: "#fff", fontSize: "20px" }}>Select Role</span>}
            rules={[{ required: true, message: 'Please pick a Role' }]}
          >
            <Radio.Group>
              <Radio value="LEO" style={{ color: "#fff" }}>LEO</Radio>
              <Radio value="Analyst" style={{ color: "#fff" }}>Analyst</Radio>
              <Radio value="Judiciary" style={{ color: "#fff" }}>Judiciary</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ background: "#444", border: "none", width: "100%" }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer projectName="BCOC" />
    </>
  );
}