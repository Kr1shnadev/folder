import React from 'react';
import Logo from './Logo';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <div style={{
      background: "rgba(0, 0, 0, 0.8)",
      padding: "0.5rem 1rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      height: "40px"
    }}>
      <div>
        <h1 style={{ 
          margin: 0,
          fontSize: "1.2rem",
          fontWeight: "500"
        }}>BCOC</h1>
        <p style={{ 
          margin: 0,
          fontSize: "0.7rem",
          opacity: 0.7
        }}>Blockchain-Powered Digital Evidence Management</p>
      </div>
      <div style={{ 
        fontSize: "0.7rem",
        opacity: 0.7 
      }}>
        © 2025 BCOC. All rights reserved.
      </div>
    </div>
  );
};

export default Header;
