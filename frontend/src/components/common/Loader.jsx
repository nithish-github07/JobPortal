import React from 'react';

const Loader = ({ fullPage = false, message = "Loading..." }) => {
    return (
        <div className={`loader-wrapper ${fullPage ? 'full-page' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="custom-loader"></div>
                <p style={{ marginTop: '16px', color: '#666', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>{message}</p>
            </div>
            <style>{`
                .loader-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding: 20px;
                }

                .loader-wrapper.full-page {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                }

                .custom-loader {
                    width: 50px;
                    height: 50px;
                    display: grid;
                    border: 4px solid #0000;
                    border-radius: 50%;
                    border-right-color: #2563eb;
                    animation: l15 1s infinite linear;
                }
                .custom-loader::before,
                .custom-loader::after {    
                    content: "";
                    grid-area: 1/1;
                    margin: 2px;
                    border: inherit;
                    border-radius: 50%;
                    animation: l15 2s infinite;
                }
                .custom-loader::after {
                    margin: 8px;
                    animation-duration: 3s;
                }
                @keyframes l15 { 
                    100%{transform: rotate(1turn)}
                }
            `}</style>
        </div>
    );
};

export default Loader;
