import React, { useState, useEffect, useRef } from 'react';

const AgentAuroraScreen = ({ onNext, onPrevious, projectData, updateProjectData }) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [documentUpdated, setDocumentUpdated] = useState(false);
    const [updatedSectionId, setUpdatedSectionId] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const documentContentRef = useRef(null);
    const sectionRefs = useRef({});

    // Start with empty documentn sections
    const [documentSections, setDocumentSections] = useState([]);

    // Sample chat history with client info from the start
    const initialMessages = [
        {
            id: 1,
            type: 'bot',
            content: 'Olá João! Sou o Agente Aurora e estou aqui para ajudar a criar as seções textuais da sua proposta de Data Lakehouse no GCP para a FakeClient. Com base nas suas seleções de blocos (Foundations, Camada RAW, Camada Bronze, Camada Silver, Camada Gold, Looker e AI Engineering), podemos criar seções como "Objetivo", "Premissas", "Itens Fora de Escopo" e "Sobre o Cliente". Compartilhe informações sobre o projeto para eu começar a elaborar o documento.',
            time: '14:32'
        }
    ];

    const [messages, setMessages] = useState(initialMessages);

    // Scroll to bottom of messages when new ones are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Scroll to updated section when document is modified
    useEffect(() => {
        if (updatedSectionId && sectionRefs.current[updatedSectionId]) {
            sectionRefs.current[updatedSectionId].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [updatedSectionId]);

    // Focus on input when component mounts
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSendMessage = () => {
        if (!message.trim() || isTyping) return;

        // Add user message
        const newMessage = {
            id: messages.length + 1,
            type: 'user',
            content: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');
        setIsTyping(true);

        // Generate responses based on message content
        let responseText = '';
        let shouldUpdateDocument = true;
        let updateInfo = {};

        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes('azure')) {
            // Convert all sections from GCP to Azure
            const updatedSections = documentSections.map(section => {
                let updatedContent;

                if (Array.isArray(section.content)) {
                    // Handle array content (like lists)
                    updatedContent = section.content.map(item =>
                        item.replace(/Google Cloud Platform \(GCP\)/g, 'Microsoft Azure')
                            .replace(/GCP/g, 'Azure')
                            .replace(/BigQuery/g, 'Azure Synapse Analytics')
                            .replace(/Data Lakehouse no GCP/g, 'Data Lakehouse no Azure')
                    );
                } else {
                    // Handle string content
                    updatedContent = section.content
                        .replace(/Google Cloud Platform \(GCP\)/g, 'Microsoft Azure')
                        .replace(/GCP/g, 'Azure')
                        .replace(/BigQuery/g, 'Azure Synapse Analytics')
                        .replace(/Data Lakehouse no GCP/g, 'Data Lakehouse no Azure');
                }

                return {
                    ...section,
                    content: updatedContent
                };
            });

            setDocumentSections(updatedSections);

            // Highlight all sections temporarily
            updatedSections.forEach(section => {
                setTimeout(() => {
                    setUpdatedSectionId(section.id);
                    setDocumentUpdated(true);
                }, 100);
            });

            // Reset highlighting after delay
            setTimeout(() => {
                setDocumentUpdated(false);
                setUpdatedSectionId(null);
            }, 3000);

            responseText = 'Atualizei todas as seções do documento, substituindo referências ao Google Cloud Platform (GCP) por Microsoft Azure e tecnologias equivalentes, como Azure Synapse Analytics no lugar do BigQuery. Atenção: Um dos blocos selecionados originalmente foi "Cloud Foundations GCP", portanto pode haver incompatibilidade entre o texto e as atividades nos documentos finais.';
            shouldUpdateDocument = false;
        }
        else if (lowerCaseMessage.includes('objetivo') || (documentSections.length === 0 && !lowerCaseMessage.includes('não'))) {
            // Initial context setup or directly requesting objective
            updateInfo = {
                section: 'objective',
                title: '2. Objetivo',
                content: 'Este projeto tem como objetivo a modernização do ambiente de Data Warehouse da FakeClient para uma arquitetura de Data Lakehouse no Google Cloud Platform (GCP), implementando pipelines de ingestão e processamento de dados escaláveis e de alto desempenho. A solução proposta visa consolidar as fontes de dados diversas em um ambiente unificado, garantindo o cumprimento de regulamentações específicas do setor de varejo, com foco em segurança e governança de dados.',
                description: 'Adicionei a seção "Objetivo" com foco na modernização do Data Warehouse da FakeClient para uma arquitetura de Data Lakehouse no GCP.',
                order: 2
            };
        }
        else if (lowerCaseMessage.includes('premissas') || lowerCaseMessage.includes('premissa')) {
            updateInfo = {
                section: 'assumptions',
                title: '3. Premissas',
                content: [
                    'O cliente FakeClient disponibilizará uma equipe técnica para fornecer informações sobre a estrutura atual do Data Warehouse e sistemas de origem.',
                    'Acesso aos ambientes (on-premises e cloud) será concedido com antecedência para a equipe de implementação do projeto.',
                    'Todos os dados sensíveis deverão seguir protocolos de segurança específicos do GCP e em conformidade com regulamentações de proteção de dados do setor de varejo.',
                    'A FakeClient designará um ponto focal técnico e um executivo para aprovações e decisões durante o projeto.',
                    'A documentação das fontes de dados, tabelas, e regras de negócio do atual Data Warehouse será fornecida pela FakeClient no início do projeto.',
                    'As credenciais de acesso ao GCP e permissões necessárias serão providenciadas pela FakeClient.'
                ],
                description: 'Criei a seção "Premissas" com seis condições importantes para o sucesso do projeto, incluindo requisitos de acesso, suporte técnico e documentação necessária da FakeClient.',
                order: 3
            };
        }
        else if (lowerCaseMessage.includes('escopo') || lowerCaseMessage.includes('exclusões')) {
            updateInfo = {
                section: 'out-of-scope',
                title: '4. Itens Fora de Escopo',
                content: [
                    'Migração de aplicações legadas que não são compatíveis com o ambiente GCP.',
                    'Desenvolvimento de novas funcionalidades de negócio nos sistemas transacionais existentes.',
                    'Criação ou modificação de dashboards analíticos e relatórios de BI além dos especificados.',
                    'Treinamento extensivo da equipe da FakeClient nas tecnologias do GCP além do conhecimento para operação.',
                    'Custos de infraestrutura, licenças BigQuery ou ferramentas de terceiros.',
                    'Suporte operacional após o período de garantia/estabilização de 2 semanas.',
                    'Migração de dados históricos com mais de 5 anos, conforme alinhado com a FakeClient.'
                ],
                description: 'Adicionei a seção "Itens Fora de Escopo" com sete exclusões específicas incluindo migração de sistemas legados, desenvolvimento de novas funcionalidades, e detalhes sobre custos de infraestrutura e licenças.',
                order: 4
            };
        }
        else if (lowerCaseMessage.includes('cliente') || lowerCaseMessage.includes('fakeclient')) {
            updateInfo = {
                section: 'about-client',
                title: '1. Sobre o Cliente',
                content: 'A FakeClient é uma empresa líder do setor de varejo em processo de transformação digital, buscando modernizar sua infraestrutura de dados para melhorar análises de negócio e tomada de decisão. Atualmente, a empresa utiliza um Data Warehouse tradicional on-premises que apresenta limitações de escalabilidade e performance. A FakeClient necessita migrar para uma arquitetura de Data Lakehouse no GCP, com atenção especial às regulamentações de proteção de dados do setor varejista e requisitos de segurança para processamento de dados de cartões de pagamento e informações pessoais de clientes.',
                description: 'Incluí a seção "Sobre o Cliente" com informações sobre a FakeClient, destacando sua posição no setor de varejo, desafios atuais com seu Data Warehouse on-premises, e requisitos específicos de segurança e conformidade.',
                order: 1
            };
        }
        else {
            responseText = 'Para construir as seções do documento, você pode me pedir para criar seções específicas como "Objetivo", "Premissas", "Itens Fora de Escopo", "Sobre o Cliente". Você também pode digitar "azure" para converter o documento para tecnologias Microsoft Azure.';
            shouldUpdateDocument = false;
        }

        // Simulate AI thinking time
        setTimeout(() => {
            let botResponse;

            if (shouldUpdateDocument) {
                const newSections = [...documentSections];
                const existingIndex = newSections.findIndex(s => s.id === updateInfo.section);

                if (existingIndex >= 0) {
                    // Update existing section
                    newSections[existingIndex] = {
                        ...newSections[existingIndex],
                        title: updateInfo.title,
                        content: updateInfo.content,
                        order: updateInfo.order
                    };
                    botResponse = {
                        id: messages.length + 2,
                        type: 'bot',
                        content: `Atualizei a seção "${updateInfo.title.split('.')[1].trim()}". ${updateInfo.description}`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                } else {
                    // Add new section
                    newSections.push({
                        id: updateInfo.section,
                        title: updateInfo.title,
                        content: updateInfo.content,
                        order: updateInfo.order
                    });
                    botResponse = {
                        id: messages.length + 2,
                        type: 'bot',
                        content: `Criei uma nova seção "${updateInfo.title.split('.')[1].trim()}". ${updateInfo.description}`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                }

                // Update document sections
                setDocumentSections(newSections);

                // Set the section to highlight and scroll to
                setUpdatedSectionId(updateInfo.section);
                setDocumentUpdated(true);

                // Reset the highlight after a delay
                setTimeout(() => {
                    setDocumentUpdated(false);
                    setUpdatedSectionId(null);
                }, 3000);
            } else {
                botResponse = {
                    id: messages.length + 2,
                    type: 'bot',
                    content: responseText,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
            }

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    // Handle key press (Enter to send)
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="screen">
            <h2 className="screen-title">Agente Aurora (IA)</h2>

            <div className="card">
                <h3 className="card-title">Agente Aurora (IA) - Criação de Textos</h3>

                <div className="chat-container">
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`message ${msg.type === 'user' ? 'message-user' : 'message-bot'}`}
                            >
                                <div className="message-content">{msg.content}</div>
                                <div className="message-time">{msg.time}</div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message message-bot typing-indicator">
                                <div className="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="document-preview">
                        <div className="preview-header">
                            <h4 className="preview-title">Visualização da Proposta <span className="preview-subtitle">(Seções IA)</span></h4>

                            <div className="document-uploader">
                                <div className="upload-file">
                                    <span className="file-icon">📄</span>
                                    <span className="file-name">requisitos_data_warehouse_FakeClient.pdf</span>
                                </div>
                                <button className="upload-btn">Anexar</button>
                            </div>
                        </div>

                        <div className="document-content" ref={documentContentRef}>
                            {documentSections.length === 0 ? (
                                <div className="empty-document-message">
                                    <p>Nenhuma seção criada ainda.</p>
                                    <p>Peça ao Agente Aurora para criar as seções da proposta como "Objetivo", "Premissas", "Itens Fora de Escopo", etc.</p>
                                </div>
                            ) : (
                                // Sort sections by order property before rendering
                                [...documentSections].sort((a, b) => a.order - b.order).map(section => (
                                    <div
                                        key={section.id}
                                        className={`document-section ${updatedSectionId === section.id ? 'section-updated' : ''}`}
                                        ref={el => sectionRefs.current[section.id] = el}
                                    >
                                        <h5 className="section-title">
                                            {section.title}
                                            <span className="ai-badge">IA</span>
                                        </h5>

                                        <div className="section-content">
                                            {Array.isArray(section.content) ? (
                                                <ol className="section-list">
                                                    {section.content.map((item, index) => (
                                                        <li key={index}>{item}</li>
                                                    ))}
                                                </ol>
                                            ) : (
                                                <p>{section.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="document-actions">
                            <button className="btn-secondary">Editar</button>
                            <button className="btn-success">Aprovar</button>
                        </div>
                    </div>
                </div>

                <div className="chat-input-container">
                    <input
                        ref={inputRef}
                        type="text"
                        className="chat-input"
                        placeholder="Digite sua mensagem ou instruções adicionais..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                    />
                    <button
                        className={`send-button ${isTyping ? 'disabled' : ''}`}
                        onClick={handleSendMessage}
                        disabled={isTyping}
                    >
                        →
                    </button>
                </div>
                <div className="input-hint">
                    Experimente: "Crie a seção de objetivo", "Adicione premissas do projeto", "Como tratamos a segurança no BigQuery?", "azure"
                </div>
            </div>

            <div className="actions-container">
                <button className="btn btn-outline" onClick={onPrevious}>Voltar</button>
                <button className="btn btn-primary" onClick={onNext}>Próximo: Documentos Finais</button>
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
        
        .card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .card-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #34495e;
          padding-bottom: 10px;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .chat-container {
          display: flex;
          height: 500px;
          gap: 20px;
        }
        
        .chat-messages {
          flex: 1;
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          padding: 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .document-preview {
          flex: 2;
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        
        .preview-header {
          margin-bottom: 15px;
        }
        
        .preview-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #34495e;
        }
        
        .preview-subtitle {
          font-size: 12px;
          color: #7f8c8d;
          font-weight: normal;
        }
        
        .document-uploader {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .upload-file {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 4px;
          background-color: #ecf0f1;
          font-size: 13px;
        }
        
        .upload-btn {
          padding: 0 15px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
        }
        
        .document-content {
          flex: 1;
          overflow-y: auto;
          border: 1px solid #ecf0f1;
          border-radius: 6px;
          padding: 15px;
          background-color: #f8fafc;
        }
        
        .empty-document-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #95a5a6;
          text-align: center;
          line-height: 1.5;
          font-style: italic;
          padding: 20px;
        }
        
        .document-section {
          margin-bottom: 20px;
          padding: 10px;
          border-radius: 6px;
          transition: all 0.5s ease;
          animation: fadeIn 0.5s ease;
        }
        
        .section-updated {
          background-color: rgba(46, 204, 113, 0.1);
          border-left: 3px solid #2ecc71;
          animation: highlight 2s ease;
        }
        
        @keyframes highlight {
          0% { background-color: rgba(46, 204, 113, 0.3); }
          100% { background-color: rgba(46, 204, 113, 0.1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .section-title {
          font-weight: bold;
          font-size: 15px;
          margin-bottom: 10px;
          color: #34495e;
          padding-bottom: 5px;
          border-bottom: 1px solid #ecf0f1;
          display: flex;
          align-items: center;
        }
        
        .ai-badge {
          display: inline-block;
          background-color: rgba(52, 152, 219, 0.1);
          color: #3498db;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          margin-left: 10px;
          font-weight: 500;
        }
        
        .section-content {
          font-size: 14px;
          line-height: 1.6;
          color: #34495e;
        }
        
        .section-list {
          margin-left: 20px;
          padding-left: 0;
        }
        
        .section-list li {
          margin-bottom: 5px;
        }
        
        .document-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 15px;
        }
        
        .btn-secondary {
          padding: 8px 15px;
          background-color: white;
          border: 1px solid #bdc3c7;
          border-radius: 4px;
          color: #34495e;
          cursor: pointer;
          font-size: 14px;
        }
        
        .btn-success {
          padding: 8px 15px;
          background-color: #2ecc71;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .message {
          max-width: 80%;
          padding: 12px 15px;
          border-radius: 10px;
          font-size: 14px;
          position: relative;
          line-height: 1.4;
          animation: messageAppear 0.3s ease;
        }
        
        @keyframes messageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message-user {
          align-self: flex-end;
          background-color: #3498db;
          color: white;
          border-bottom-right-radius: 0;
        }
        
        .message-bot {
          align-self: flex-start;
          background-color: #ecf0f1;
          color: #34495e;
          border-bottom-left-radius: 0;
        }
        
        .message-time {
          font-size: 10px;
          opacity: 0.7;
          margin-top: 5px;
          text-align: right;
        }
        
        .typing-indicator {
          padding: 12px;
          display: flex;
          align-items: center;
        }
        
        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .typing-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #95a5a6;
          display: block;
          animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typingAnimation {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        
        .chat-input-container {
          display: flex;
          margin-top: 15px;
          gap: 10px;
        }
        
        .chat-input {
          flex: 1;
          padding: 12px 15px;
          border-radius: 30px;
          border: 1px solid #bdc3c7;
          outline: none;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        
        .chat-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
        }
        
        .chat-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        
        .send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #3498db;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .send-button:hover {
          background-color: #2980b9;
          transform: scale(1.05);
        }
        
        .send-button.disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .input-hint {
          font-size: 12px;
          color: #7f8c8d;
          padding: 5px 15px;
          font-style: italic;
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
          transform: translateY(-2px);
        }
        
        .btn-outline {
          background-color: transparent;
          border: 1px solid #3498db;
          color: #3498db;
        }
        
        .btn-outline:hover {
          background-color: rgba(52, 152, 219, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

export default AgentAuroraScreen;