import React from 'react';

interface SplashScreenProps {
  isLoading: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  console.log('🦈 SplashScreen is rendering...');

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1e3a8a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column'
      }}
    >
      <div style={{ textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          🦈 FINDS
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#06b6d4' }}>
          Forecasted Incidents of Nautical Danger System
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: '#06b6d4',
            borderRadius: '50%',
            margin: '0 5px',
            animation: 'bounce 1s infinite'
          }}></div>
          <div style={{ 
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: '#06b6d4',
            borderRadius: '50%',
            margin: '0 5px',
            animation: 'bounce 1s infinite 0.1s'
          }}></div>
          <div style={{ 
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: '#06b6d4',
            borderRadius: '50%',
            margin: '0 5px',
            animation: 'bounce 1s infinite 0.2s'
          }}></div>
        </div>
        
        <div style={{ fontSize: '1.2rem', color: '#fbbf24' }}>
          Loading on MacBook Pro M2...
        </div>
        
        <div style={{ 
          width: '300px', 
          height: '4px', 
          backgroundColor: '#374151', 
          borderRadius: '2px',
          margin: '2rem auto 0',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
            animation: 'progress 3s ease-in-out infinite'
          }}></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;