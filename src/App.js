import React, { useState } from 'react';
import BlocksSelectionScreen from './components/BlocksSelectionScreen';
import TeamTimelineScreen from './components/TeamTimelineScreen';
import AgentAuroraScreen from './components/AgentAuroraScreen';
import FinalDocumentsScreen from './components/FinalDocumentsScreen';

const AuroraApp = () => {
    const [currentStep, setCurrentStep] = useState(1);
    // Adicione o estado do projeto para compartilhar dados entre as telas
    const [projectData, setProjectData] = useState({});

    const goToStep = (step) => {
        setCurrentStep(step);
    };

    // Função para atualizar os dados do projeto
    const updateProjectData = (newData) => {
        setProjectData(prevData => ({
            ...prevData,
            ...newData
        }));
    };

    const renderCurrentScreen = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BlocksSelectionScreen
                        onNext={() => goToStep(2)}
                        projectData={projectData}
                        updateProjectData={updateProjectData}
                    />
                );
            case 2:
                return (
                    <TeamTimelineScreen
                        onNext={() => goToStep(3)}
                        onPrevious={() => goToStep(1)}
                        projectData={projectData}
                        updateProjectData={updateProjectData}
                    />
                );
            case 3:
                return (
                    <AgentAuroraScreen
                        onNext={() => goToStep(4)}
                        onPrevious={() => goToStep(2)}
                        projectData={projectData}
                        updateProjectData={updateProjectData}
                    />
                );
            case 4:
                return (
                    <FinalDocumentsScreen
                        onPrevious={() => goToStep(3)}
                        onNewProposal={() => {
                            setProjectData({});
                            goToStep(1);
                        }}
                        projectData={projectData}
                    />
                );
            default:
                return (
                    <BlocksSelectionScreen
                        onNext={() => goToStep(2)}
                        projectData={projectData}
                        updateProjectData={updateProjectData}
                    />
                );
        }
    };

    return (
        <div className="aurora-app">
            <header className="app-header">
                <div className="logo">Plataforma Aurora</div>
                <div className="user-profile">
                    <span className="user-name">João Silva</span>
                    <div className="user-avatar">JS</div>
                </div>
            </header>

            <div className="container">
                <div className="stepper">
                    {[1, 2, 3, 4].map(step => (
                        <div
                            key={step}
                            className={`step ${currentStep === step ? 'active' : ''} ${step < currentStep ? 'completed' : ''}`}
                            onClick={() => goToStep(step)}
                        >
                            <div className="step-number">{step}</div>
                            <div className="step-label">
                                {step === 1 && 'Blocos e Atividades'}
                                {step === 2 && 'Time e Cronograma'}
                                {step === 3 && 'Agente Aurora (IA)'}
                                {step === 4 && 'Documentos Finais'}
                            </div>
                        </div>
                    ))}
                </div>

                {renderCurrentScreen()}
            </div>

            <style jsx>{`
        .aurora-app {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #2c3e50;
          background-color: #f5f7fa;
          min-height: 100vh;
        }
        
        .app-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 30px;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .logo {
          font-size: 22px;
          font-weight: bold;
          color: #3498db;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .user-name {
          font-size: 15px;
        }
        
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #3498db;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          position: relative;
        }
        
        .stepper:after {
          content: '';
          position: absolute;
          top: 14px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #bdc3c7;
          z-index: 1;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          cursor: pointer;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: white;
          border: 2px solid #bdc3c7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          font-weight: bold;
          transition: all 0.3s;
        }
        
        .step.active .step-number {
          background-color: #3498db;
          border-color: #3498db;
          color: white;
        }
        
        .step.completed .step-number {
          background-color: #2ecc71;
          border-color: #2ecc71;
          color: white;
        }
        
        .step-label {
          font-size: 14px;
        }
      `}</style>
        </div>
    );
};

export default AuroraApp;