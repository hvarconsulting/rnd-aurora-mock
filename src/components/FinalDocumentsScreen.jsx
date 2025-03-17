import React from 'react';

const FinalDocumentsScreen = ({ onPrevious, onNewProposal, projectData }) => {
    return (
        <div className="screen">
            <h2 className="screen-title">Documentos Finais</h2>

            <div className="success-banner">
                <div className="success-icon">✓</div>
                <h3 className="success-title">Proposta Gerada com Sucesso!</h3>
                <p className="success-message">
                    Todos os documentos foram criados e estão disponíveis no seu Google Drive.
                </p>
            </div>

            <div className="document-card">
                <div className="document-icon">
                    <span>📊</span>
                </div>
                <div className="document-info">
                    <h3 className="document-title">Planilha de Estimativa</h3>
                    <p className="document-description">
                        Planilha detalhada com horas, custos e cronograma do projeto
                    </p>
                </div>
                <button className="btn btn-primary">Abrir no Google Sheets</button>
            </div>

            <div className="document-card">
                <div className="document-icon">
                    <span>📝</span>
                </div>
                <div className="document-info">
                    <h3 className="document-title">Proposta Técnica-Comercial</h3>
                    <p className="document-description">
                        Documento completo com escopo, atividades, premissas e cronograma
                    </p>
                </div>
                <button className="btn btn-primary">Abrir no Google Docs</button>
            </div>

            <div className="document-details">
                <div className="detail-item">
                    <h4 className="detail-title">Escopo</h4>
                    <ul className="detail-list">
                        <li>Camada RAW - Ingestão de Dados</li>
                        <li>Camada Bronze - Processamento de Dados</li>
                        <li>Camada Silver - Modelagem de Dados</li>
                        <li>Camada Gold - Visualização de Dados</li>
                        <li>Looker - BI e Dashboards</li>
                        <li>AI Engine - Machine Learning</li>
                    </ul>
                </div>

                <div className="detail-item">
                    <h4 className="detail-title">Equipe</h4>
                    <ul className="detail-list">
                        <li>1× Tech Lead Data Engineer</li>
                        <li>3× Engenheiro de Dados</li>
                        <li>1× Analista de Dados</li>
                        <li>2× Engenheiro de IA</li>
                    </ul>
                </div>

                <div className="detail-item">
                    <h4 className="detail-title">Duração</h4>
                    <p className="detail-text">
                        12 semanas
                    </p>
                </div>
            </div>

            <div className="actions-container">
                <button className="btn btn-outline" onClick={onPrevious}>Voltar</button>
                <button className="btn btn-outline" onClick={onNewProposal}>Iniciar Nova Proposta</button>
            </div>

            <style jsx>{`
        .screen {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .screen-title {
          font-size: 24px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        .success-banner {
          background-color: rgba(46, 204, 113, 0.1);
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .success-icon {
          font-size: 60px;
          color: #2ecc71;
          margin-bottom: 15px;
        }
        
        .success-title {
          font-size: 24px;
          font-weight: bold;
          color: #34495e;
          margin-bottom: 10px;
        }
        
        .success-message {
          font-size: 16px;
          color: #7f8c8d;
        }
        
        .document-card {
          display: flex;
          align-items: center;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          gap: 20px;
          transition: all 0.3s;
        }
        
        .document-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .document-icon {
          width: 60px;
          height: 60px;
          background-color: rgba(52, 152, 219, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #3498db;
        }
        
        .document-info {
          flex: 1;
        }
        
        .document-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #2c3e50;
        }
        
        .document-description {
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .document-details {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          padding: 20px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
        }
        
        .detail-item {
          flex: 1;
          padding: 0 15px;
        }
        
        .detail-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #34495e;
          padding-bottom: 5px;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .detail-list {
          font-size: 14px;
          color: #34495e;
          padding-left: 20px;
          margin: 0;
        }
        
        .detail-list li {
          margin-bottom: 5px;
        }
        
        .detail-text {
          font-size: 14px;
          color: #34495e;
        }
        
        .actions-container {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 20px;
        }
        
        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .btn-primary {
          background-color: #3498db;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background-color: #2980b9;
        }
        
        .btn-outline {
          background-color: transparent;
          border: 1px solid #3498db;
          color: #3498db;
        }
        
        .btn-outline:hover {
          background-color: rgba(52, 152, 219, 0.1);
        }
      `}</style>
        </div>
    );
};

export default FinalDocumentsScreen;