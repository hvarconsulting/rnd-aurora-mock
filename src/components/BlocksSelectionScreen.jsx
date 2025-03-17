import React, { useState, useEffect } from 'react';

const BlocksSelectionScreen = ({ onNext, projectData, updateProjectData }) => {
    // State for selected blocks and activities
    const [selectedBlocks, setSelectedBlocks] = useState(projectData?.blocks || []);
    const [blockSearch, setBlockSearch] = useState('');
    const [activitySearch, setActivitySearch] = useState('');
    const [showActivitySelector, setShowActivitySelector] = useState(null);
    const [totalHours, setTotalHours] = useState(0);

    // Define available blocks data
    const availableBlocks = [
        {
            id: 'inicializacao',
            title: 'Inicialização (Plan)',
            description: 'Atividades iniciais do projeto',
            baseHours: 20
        },
        {
            id: 'foundations',
            title: 'Foundations',
            description: 'DEV e PRD',
            baseHours: 160
        },
        {
            id: 'camada_raw',
            title: 'Camada RAW - Ingestão e Data Movement',
            description: 'Framework genérico de desenvolvimento para pipelines de ingestão e coleta',
            baseHours: 70
        },
        {
            id: 'camada_bronze',
            title: 'Camada Bronze',
            description: 'Deduplicação, cleansing, e outros processos de data prep',
            baseHours: 30
        },
        {
            id: 'camada_silver',
            title: 'Camada Silver - Assuntos/Domínios de Dados',
            description: 'Modelagem de dados em datamarts para uso nos modelos',
            baseHours: 128
        },
        {
            id: 'camada_gold',
            title: 'Camada Gold - Datamarts',
            description: 'Modelagem de dados em visões para os dashboards',
            baseHours: 128
        },
        {
            id: 'machine_learning',
            title: 'Machine Learning',
            description: 'Desenvolvimento de modelos de propensão e clusterização',
            baseHours: 364
        },
        {
            id: 'looker',
            title: 'Looker',
            description: 'Desenvolvimento de dashboards e relatórios',
            baseHours: 168
        },
        {
            id: 'prep_final',
            title: 'Preparação Final (Deploy)',
            description: 'Deploy e configuração em produção',
            baseHours: 40
        },
        {
            id: 'golive',
            title: 'Go Live e Suporte',
            description: 'Acompanhamento e estabilização',
            baseHours: 40
        }
    ];

    // Define available activities by block
    const availableActivities = {
        'inicializacao': [
            {
                id: 'prep_kickoff',
                title: 'Preparar Kick Off',
                description: 'Todos do time',
                hours: 4,
                fixed: true,
                category: 'Planejamento'
            },
            {
                id: 'realizar_kickoff',
                title: 'Realizar Kick Off',
                description: 'Todos do time presentes no Kick-Off',
                hours: 8,
                fixed: true,
                category: 'Planejamento'
            },
            {
                id: 'alinhamento',
                title: 'Alinhamento das demandas',
                description: 'Alinhar demandas, mapear, falar com os envolvidos',
                hours: 8,
                fixed: true,
                category: 'Planejamento'
            }
        ],
        'foundations': [
            {
                id: 'cloud_identity',
                title: 'Cloud Identity e organização',
                description: 'Identity + Organizacao + DNS',
                hours: 48,
                fixed: true,
                category: 'Configuração'
            },
            {
                id: 'usuarios_grupos',
                title: 'Usuários e grupos',
                description: 'Grupos por perfil, Usuarios, Federacao AD caso necessario',
                hours: 12,
                fixed: true,
                category: 'Configuração'
            },
            {
                id: 'integracao_ad',
                title: 'Integracao AD',
                description: 'Federacao do AD + contato para mais de 50 usuarios',
                hours: 16,
                fixed: true,
                category: 'Configuração'
            },
            {
                id: 'acesso_admin',
                title: 'Acesso administrativo',
                description: 'Usuarios admin e super admin',
                hours: 4,
                fixed: true,
                category: 'Configuração'
            },
            {
                id: 'faturamento',
                title: 'Configurar o faturamento',
                description: 'Orcamento e alertas',
                hours: 4,
                fixed: true,
                category: 'Configuração'
            },
            {
                id: 'rede_vpc',
                title: 'Rede VPC, VPN',
                description: 'Net e Sub-Net, Firewall, Rotas, VPN ou Interconect',
                hours: 28,
                fixed: true,
                category: 'Infraestrutura'
            },
            {
                id: 'service_controls',
                title: 'Service Controls',
                description: 'Controle de acesso por Service Controls',
                hours: 24,
                fixed: true,
                category: 'Segurança'
            }
        ],
        'camada_raw': [
            {
                id: 'framework_ingestao',
                title: 'Framework de ingestão e coleta',
                description: 'Framework genérico de desenvolvimento p/ pipelines de ingestão e coleta',
                hours: 48,
                fixed: true,
                category: 'Framework'
            },
            {
                id: 'pipelines_ingestao',
                title: 'Ingestão de Arquivos',
                description: 'Ingestão de flat files e planilhas (contar por sheet)',
                baseHours: 1,
                fixed: false,
                unit: 'arquivo',
                category: 'Ingestão',
                defaultQuantity: 10
            },
            {
                id: 'orquestracao',
                title: 'Orquestração',
                description: 'DAGs genéricas',
                baseHours: 4,
                fixed: false,
                unit: 'pipeline',
                defaultQuantity: 1,
                category: 'Orquestração'
            },
            {
                id: 'analise',
                title: 'Análise e entendimento das bases e processos',
                description: 'Entendimento geral das bases e processos apresentados',
                baseHours: 8,
                unit: 'base',
                defaultQuantity: 1,
                fixed: false,
                category: 'Análise'
            },
            {
                id: 'ingestao_db',
                title: 'Ingestão de banco de dados relacional',
                description: 'Extração e ingestão de dados de bancos SQL',
                baseHours: 8,
                fixed: false,
                unit: 'tabela',
                category: 'Ingestão',
                defaultQuantity: 10
            },
            {
                id: 'ingestao_apis',
                title: 'Ingestão de APIs REST',
                description: 'Consumo e processamento de dados de APIs externas',
                baseHours: 6,
                fixed: false,
                unit: 'endpoint',
                category: 'Ingestão',
                defaultQuantity: 10
            }
        ],
        'camada_bronze': [
            {
                id: 'pipeline_bronze',
                title: 'Pipeline Raw > Bronze',
                description: 'Deduplicação, cleansing, e outros processo de data prep',
                baseHours: 1,
                fixed: false,
                unit: 'tabela',
                category: 'Pipeline',
                defaultQuantity: 10
            },
            {
                id: 'orquestracao_bronze',
                title: 'Orquestração',
                description: 'DAGs genéricas',
                baseHours: 4,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Orquestração'
            },
            {
                id: 'testes_bronze',
                title: 'Testes Unitarios e Ajustes',
                description: 'Testes e ajustes da camada bronze',
                baseHours: 16,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Testes'
            }
        ],
        'camada_silver': [
            {
                id: 'pipeline_silver',
                title: 'Pipeline Bronze > Silver',
                description: 'Modelagem de dados em datamarts e domínios de negócio',
                baseHours: 24,
                fixed: false,
                unit: 'datamart',
                category: 'Pipeline',
                defaultQuantity: 1
            },
            {
                id: 'analise_silver',
                title: 'Análise e entendimento das bases e processos',
                description: 'Análise e otimização do modelo de dados orientado à visão de negócio',
                baseHours: 16,
                unit: 'base',
                defaultQuantity: 1,
                fixed: false,
                category: 'Análise'
            },
            {
                id: 'orquestracao_silver',
                title: 'Orquestração',
                description: 'DAGs genéricas',
                baseHours: 16,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Orquestração'
            },
            {
                id: 'testes_silver',
                title: 'Testes Unitarios e Ajustes',
                description: 'Testes e ajustes da camada silver',
                baseHours: 24,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Testes'
            }
        ],
        'camada_gold': [
            {
                id: 'pipeline_gold',
                title: 'Pipeline Silver > Gold',
                description: 'Modelagem de dados em visões para os dashboards Looker',
                baseHours: 48,
                fixed: false,
                unit: 'visão',
                category: 'Pipeline',
                defaultQuantity: 1
            },
            {
                id: 'analise_gold',
                title: 'Análise e entendimento das bases e processos',
                description: 'Análise e otimização dos modelos e relatórios das camadas para serving de dados',
                baseHours: 24,
                unit: 'base',
                defaultQuantity: 1,
                fixed: false,
                category: 'Análise'
            },
            {
                id: 'orquestracao_gold',
                title: 'Orquestração',
                description: 'DAGs genéricas',
                baseHours: 16,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Orquestração'
            },
            {
                id: 'testes_gold',
                title: 'Testes Unitarios e Ajustes',
                description: 'Testes e ajustes da camada gold',
                baseHours: 24,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Testes'
            }
        ],
        'machine_learning': [
            {
                id: 'analise_dados',
                title: 'Análise de dados base de clientes',
                description: 'Entendimento de todos o ciclo de vida do cliente',
                baseHours: 48,
                unit: 'base',
                defaultQuantity: 1,
                fixed: false,
                category: 'Análise'
            },
            {
                id: 'ciclos_treinamento',
                title: 'Ciclos de Treinamento e Validação',
                description: 'Treinamento e validação dos modelos',
                baseHours: 48,
                unit: 'modelo',
                defaultQuantity: 1,
                fixed: false,
                category: 'Modelagem'
            },
            {
                id: 'analise_resultados',
                title: 'Análise de resultados',
                description: 'Análise e interpretação dos resultados dos modelos',
                baseHours: 48,
                unit: 'modelo',
                defaultQuantity: 1,
                fixed: false,
                category: 'Análise'
            },
            {
                id: 'orquestracao_ml',
                title: 'Orquestração',
                description: 'Desenvolvimento de dags de orquestração de modelos',
                baseHours: 16,
                unit: 'pipeline',
                defaultQuantity: 1,
                fixed: false,
                category: 'Orquestração'
            },
            {
                id: 'deploy_modelos',
                title: 'Deploy de modelos',
                description: 'Implantação de modelos em Vertex Endpoints',
                baseHours: 16,
                unit: 'modelo',
                defaultQuantity: 1,
                fixed: false,
                category: 'Deploy'
            },
            {
                id: 'testes_ml',
                title: 'Testes Unitários e Ajustes',
                description: 'Testes e ajustes dos modelos',
                baseHours: 24,
                unit: 'modelo',
                defaultQuantity: 1,
                fixed: false,
                category: 'Testes'
            }
        ],
        'looker': [
            {
                id: 'entendimento_relatorios',
                title: 'Entendimento de relatórios e dashboards',
                description: 'Entendimendo e levantamento das visualizações que serão feitas',
                baseHours: 24,
                unit: 'report',
                defaultQuantity: 1,
                fixed: false,
                category: 'Análise'
            },
            {
                id: 'desenvolvimento_dashboards',
                title: 'Desenvolvimento de dashboards',
                description: 'Desenvolver dashboards de data vis',
                baseHours: 48,
                fixed: false,
                unit: 'report',
                category: 'Desenvolvimento',
                defaultQuantity: 1
            },
            {
                id: 'testes_looker',
                title: 'Testes Unitários e Ajustes',
                description: 'Testes e ajustes dos dashboards',
                baseHours: 24,
                unit: 'report',
                defaultQuantity: 1,
                fixed: false,
                category: 'Testes'
            }
        ],
        'prep_final': [
            {
                id: 'deploy_datalake',
                title: 'Deploy Datalake',
                description: 'Deploy Datalake em PRD',
                hours: 20,
                fixed: true,
                category: 'Deploy'
            },
            {
                id: 'prog_cargas',
                title: 'Programação de Cargas',
                description: 'Agendamento das cargas em PRD',
                baseHours: 1,
                unit: 'carga',
                defaultQuantity: 5,
                fixed: false,
                category: 'Carga'
            },
            {
                id: 'cargas_full',
                title: 'Cargas Full (Datalake)',
                description: 'Cargas históricas em PRD',
                baseHours: 8,
                unit: 'carga',
                defaultQuantity: 1,
                fixed: false,
                category: 'Carga'
            }
        ],
        'golive': [
            {
                id: 'suporte',
                title: 'Suporte',
                description: 'Suporte técnico e operacional',
                baseHours: 8,
                unit: 'dias',
                defaultQuantity: 7,
                fixed: false,
                category: 'Suporte'
            }
        ]
    };

    // Initial state if we have saved project data
    useEffect(() => {
        if (projectData?.blocks) {
            setSelectedBlocks(projectData.blocks);
        }
    }, [projectData]);

    // Calculate total hours
    useEffect(() => {
        let hours = 0;

        selectedBlocks.forEach(block => {
            block.activities.forEach(activity => {
                if (activity.fixed) {
                    hours += activity.hours;
                } else {
                    hours += activity.baseHours * activity.quantity;
                }
            });
        });

        setTotalHours(hours);
    }, [selectedBlocks]);

    // Save data when moving to next screen
    const handleNext = () => {
        updateProjectData({ blocks: selectedBlocks });
        onNext();
    };

    // Add a block to selected blocks
    const addBlock = (block) => {
        // Check if block is already added
        const exists = selectedBlocks.some(b => b.id === block.id);
        if (exists) return;

        // Create block with empty activities array
        const newBlock = {
            ...block,
            activities: []
        };

        setSelectedBlocks([...selectedBlocks, newBlock]);
        setShowActivitySelector(block.id);
    };

    // Remove a block
    const removeBlock = (blockId) => {
        setSelectedBlocks(selectedBlocks.filter(block => block.id !== blockId));
        if (showActivitySelector === blockId) {
            setShowActivitySelector(null);
        }
    };

    // Add an activity to a block
    const addActivity = (blockId, activity) => {
        const blockIndex = selectedBlocks.findIndex(block => block.id === blockId);
        if (blockIndex === -1) return;

        // Check if activity is already added
        const activityExists = selectedBlocks[blockIndex].activities.some(a => a.id === activity.id);
        if (activityExists) return;

        // Add activity with quantity if it's parametrized
        const newActivity = { ...activity };
        if (!activity.fixed && activity.defaultQuantity) {
            newActivity.quantity = activity.defaultQuantity;
        } else if (!activity.fixed) {
            newActivity.quantity = 1;
        }

        const updatedBlocks = [...selectedBlocks];
        updatedBlocks[blockIndex].activities.push(newActivity);

        setSelectedBlocks(updatedBlocks);
    };

    // Remove an activity
    const removeActivity = (blockId, activityId) => {
        const blockIndex = selectedBlocks.findIndex(block => block.id === blockId);
        if (blockIndex === -1) return;

        const updatedBlocks = [...selectedBlocks];
        updatedBlocks[blockIndex].activities = updatedBlocks[blockIndex].activities.filter(
            activity => activity.id !== activityId
        );

        setSelectedBlocks(updatedBlocks);
    };

    // Update activity quantity
    const updateActivityQuantity = (blockId, activityId, quantity) => {
        const blockIndex = selectedBlocks.findIndex(block => block.id === blockId);
        if (blockIndex === -1) return;

        const activityIndex = selectedBlocks[blockIndex].activities.findIndex(
            activity => activity.id === activityId
        );
        if (activityIndex === -1) return;

        const updatedBlocks = [...selectedBlocks];
        updatedBlocks[blockIndex].activities[activityIndex].quantity = parseInt(quantity) || 1;

        setSelectedBlocks(updatedBlocks);
    };

    // Function to add all activities for a block
    const addAllActivities = (blockId) => {
        const blockIndex = selectedBlocks.findIndex(block => block.id === blockId);
        if (blockIndex === -1) return;

        const activitiesToAdd = availableActivities[blockId].filter(activity => {
            return !selectedBlocks[blockIndex].activities.some(a => a.id === activity.id);
        });

        const updatedBlocks = [...selectedBlocks];
        activitiesToAdd.forEach(activity => {
            const newActivity = { ...activity };
            if (!activity.fixed && activity.defaultQuantity) {
                newActivity.quantity = activity.defaultQuantity;
            } else if (!activity.fixed) {
                newActivity.quantity = 1;
            }
            updatedBlocks[blockIndex].activities.push(newActivity);
        });

        setSelectedBlocks(updatedBlocks);
    };

    // Filter blocks based on search
    const filteredBlocks = availableBlocks.filter(block =>
        block.title.toLowerCase().includes(blockSearch.toLowerCase()) ||
        block.description.toLowerCase().includes(blockSearch.toLowerCase())
    );

    // Determine if a block is already selected
    const isBlockSelected = (blockId) => {
        return selectedBlocks.some(block => block.id === blockId);
    };

    // Get total hours for a block
    const getBlockHours = (blockId) => {
        const block = selectedBlocks.find(b => b.id === blockId);
        if (!block) return 0;

        let hours = 0;
        block.activities.forEach(activity => {
            if (activity.fixed) {
                hours += activity.hours;
            } else {
                hours += activity.baseHours * activity.quantity;
            }
        });

        return hours;
    };

    // Filter activities based on search
    const getFilteredActivities = (blockId) => {
        if (!availableActivities[blockId]) return [];

        return availableActivities[blockId].filter(activity =>
            activity.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
            (activity.description && activity.description.toLowerCase().includes(activitySearch.toLowerCase())) ||
            (activity.category && activity.category.toLowerCase().includes(activitySearch.toLowerCase()))
        );
    };

    // Check if an activity is already added to a block
    const isActivitySelected = (blockId, activityId) => {
        const block = selectedBlocks.find(b => b.id === blockId);
        if (!block) return false;

        return block.activities.some(activity => activity.id === activityId);
    };

    // Group activities by category
    const groupActivitiesByCategory = (activities) => {
        const grouped = {};

        activities.forEach(activity => {
            if (!activity.category) return;

            if (!grouped[activity.category]) {
                grouped[activity.category] = [];
            }
            grouped[activity.category].push(activity);
        });

        return grouped;
    };

    return (
        <div className="screen-container">
            <h2 className="page-title">Blocos e Atividades</h2>

            <div className="main-layout">
                <div className="left-panel">
                    <div className="panel-header">
                        <h3>Blocos Disponíveis</h3>
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Pesquisar blocos..."
                                value={blockSearch}
                                onChange={(e) => setBlockSearch(e.target.value)}
                            />
                            <span className="search-icon">🔍</span>
                        </div>
                    </div>

                    <div className="blocks-list">
                        {filteredBlocks.map(block => (
                            <div key={block.id} className="block-item">
                                <div className="block-info">
                                    <div className="block-title">{block.title}</div>
                                    <div className="block-description">{block.description}</div>
                                    <div className="block-hours">{block.baseHours}h</div>
                                </div>

                                {isBlockSelected(block.id) ? (
                                    <button
                                        className="block-button block-button-disabled"
                                        disabled
                                    >
                                        Adicionado
                                    </button>
                                ) : (
                                    <button
                                        className="block-button block-button-add"
                                        onClick={() => addBlock(block)}
                                    >
                                        Adicionar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-panel">
                    <div className="panel-header">
                        <h3>Blocos Selecionados</h3>
                    </div>

                    {selectedBlocks.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhum bloco selecionado</p>
                            <p>Adicione blocos do painel à esquerda para começar</p>
                        </div>
                    ) : (
                        <div className="selected-blocks">
                            {selectedBlocks.map(block => (
                                <div key={block.id} className="selected-block">
                                    <div className="selected-block-header">
                                        <div className="selected-block-info">
                                            <div className="selected-block-title">{block.title}</div>
                                            <div className="selected-block-hours">{getBlockHours(block.id)}h</div>
                                        </div>

                                        <div className="selected-block-actions">
                                            <button
                                                className="action-button"
                                                onClick={() => setShowActivitySelector(showActivitySelector === block.id ? null : block.id)}
                                            >
                                                {showActivitySelector === block.id ? 'Fechar' : 'Adicionar Atividades'}
                                            </button>

                                            <button
                                                className="action-button action-remove"
                                                onClick={() => removeBlock(block.id)}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>

                                    {/* Activities list */}
                                    {block.activities.length > 0 && (
                                        <div className="activities-table-container">
                                            <table className="activities-table">
                                                <thead>
                                                    <tr>
                                                        <th className="activities-table-name">Nome</th>
                                                        <th className="activities-table-category">Categoria</th>
                                                        <th className="activities-table-hours">Horas</th>
                                                        <th className="activities-table-actions"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {block.activities.map(activity => (
                                                        <tr key={activity.id} className="activity-row">
                                                            <td className="activity-name-cell">
                                                                <div className="activity-name">{activity.title}</div>
                                                                {activity.description && (
                                                                    <div className="activity-description">{activity.description}</div>
                                                                )}
                                                            </td>
                                                            <td className="activity-category-cell">
                                                                {activity.category && (
                                                                    <span className="activity-category-tag">{activity.category}</span>
                                                                )}
                                                            </td>
                                                            <td className="activity-hours-cell">
                                                                {activity.fixed ? (
                                                                    <span>{activity.hours}h</span>
                                                                ) : (
                                                                    <div className="activity-quantity-container">
                                                                        <div className="quantity-control">
                                                                            <input
                                                                                type="number"
                                                                                className="quantity-input"
                                                                                min="1"
                                                                                value={activity.quantity || 1}
                                                                                onChange={(e) => updateActivityQuantity(block.id, activity.id, e.target.value)}
                                                                            />
                                                                            <span className="quantity-unit">
                                                                                {activity.unit}
                                                                                {activity.quantity > 1 ? 's' : ''}
                                                                            </span>
                                                                            <span>×</span>
                                                                            <span>{activity.baseHours}h</span>
                                                                            <span>=</span>
                                                                            <span className="total-hours">
                                                                                {activity.baseHours * (activity.quantity || 1)}h
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="activity-actions-cell">
                                                                <button
                                                                    className="activity-remove-button"
                                                                    onClick={() => removeActivity(block.id, activity.id)}
                                                                >
                                                                    ×
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Activity selector */}
                                    {showActivitySelector === block.id && (
                                        <div className="activity-selector">
                                            <div className="activity-selector-header">
                                                <h4>Adicionar Atividades</h4>
                                                <div className="activity-search">
                                                    <input
                                                        type="text"
                                                        className="search-input"
                                                        placeholder="Pesquisar atividades..."
                                                        value={activitySearch}
                                                        onChange={(e) => setActivitySearch(e.target.value)}
                                                    />
                                                    <span className="search-icon">🔍</span>
                                                </div>
                                                <button
                                                    className="activity-button activity-button-add-all"
                                                    onClick={() => addAllActivities(block.id)}
                                                >
                                                    Adicionar Todas
                                                </button>
                                            </div>

                                            <div className="activity-categories">
                                                {Object.entries(groupActivitiesByCategory(getFilteredActivities(block.id))).map(([category, activities]) => (
                                                    <div key={category} className="activity-category">
                                                        <h5 className="category-name">{category}</h5>

                                                        <div className="category-activities">
                                                            {activities.map(activity => (
                                                                <div key={activity.id} className="activity-option">
                                                                    <div className="activity-option-info">
                                                                        <div className="activity-option-title">{activity.title}</div>
                                                                        <div className="activity-option-hours">
                                                                            {activity.fixed ? `${activity.hours}h` : `${activity.baseHours}h/${activity.unit}`}
                                                                        </div>
                                                                    </div>

                                                                    {isActivitySelected(block.id, activity.id) ? (
                                                                        <button
                                                                            className="activity-button activity-button-disabled"
                                                                            disabled
                                                                        >
                                                                            Adicionado
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="activity-button activity-button-add"
                                                                            onClick={() => addActivity(block.id, activity)}
                                                                        >
                                                                            Adicionar
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                                {getFilteredActivities(block.id).length === 0 && (
                                                    <div className="no-activities">
                                                        Nenhuma atividade encontrada com esse filtro.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="footer">
                <div className="stats">
                    <div className="stat-item">
                        <div className="stat-label">Blocos</div>
                        <div className="stat-value">{selectedBlocks.length}</div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-label">Atividades</div>
                        <div className="stat-value">
                            {selectedBlocks.reduce((total, block) => total + block.activities.length, 0)}
                        </div>
                    </div>

                    <div className="stat-item">
                        <div className="stat-label">Horas Totais</div>
                        <div className="stat-value">{totalHours}</div>
                    </div>
                </div>

                <div className="actions">
                    <button className="action-button action-secondary">
                        Salvar Rascunho
                    </button>

                    <button
                        className="action-button action-primary"
                        onClick={handleNext}
                        disabled={selectedBlocks.length === 0}
                    >
                        Próximo: Time e Cronograma
                    </button>
                </div>
            </div>

            <style jsx>{`
        .screen-container {
          padding: 0 30px 30px;
          width: 100%;
        }
        
        .page-title {
          font-size: 24px;
          font-weight: 500;
          margin: 20px 0;
          color: #34495e;
        }
        
        .main-layout {
          display: flex;
          gap: 25px;
          margin-bottom: 20px;
          height: calc(100vh - 180px);
          min-height: 500px;
        }
        
        .left-panel, .right-panel {
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .left-panel {
          width: 35%;
        }
        
        .right-panel {
          width: 65%;
        }
        
        .panel-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e1e4e8;
        }
        
        .panel-header h3 {
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 12px;
          color: #34495e;
        }
        
        .search-container {
          position: relative;
        }
        
        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }
        
        .search-input {
          width: 100%;
          padding: 8px 12px 8px 32px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          color: #34495e;
        }
        
        .blocks-list {
          padding: 12px;
          overflow-y: auto;
          flex-grow: 1;
        }
        
        .block-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        .block-item:hover {
          border-color: #3498db;
        }
        
        .block-info {
          flex-grow: 1;
        }
        
        .block-title {
          font-weight: 600;
          font-size: 15px;
          margin-bottom: 5px;
          color: #34495e;
        }
        
        .block-description {
          font-size: 13px;
          color: #7f8c8d;
          margin-bottom: 5px;
        }
        
        .block-hours {
          font-size: 13px;
          color: #3498db;
          font-weight: 500;
        }
        
        .block-button {
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }
        
        .block-button-add {
          background-color: #3498db;
          color: white;
        }
        
        .block-button-add:hover {
          background-color: #2980b9;
        }
        
        .block-button-disabled {
          background-color: #ecf0f1;
          color: #95a5a6;
          cursor: default;
        }
        
        .selected-blocks {
          padding: 12px;
          overflow-y: auto;
          flex-grow: 1;
        }
        
        .selected-block {
          border: 1px solid #3498db;
          border-radius: 4px;
          margin-bottom: 15px;
          overflow: hidden;
        }
        
        .selected-block-header {
          background-color: #f8f9fa;
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e1e4e8;
        }
        
        .selected-block-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .selected-block-title {
          font-weight: 600;
          font-size: 15px;
          color: #34495e;
        }
        
        .selected-block-hours {
          font-weight: 600;
          font-size: 14px;
          color: #3498db;
          background-color: rgba(52, 152, 219, 0.1);
          padding: 2px 8px;
          border-radius: 12px;
        }
        
        .selected-block-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-button {
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          border: 1px solid #ddd;
          background-color: white;
          color: #34495e;
        }
        
        .action-button:hover {
          background-color: #f8f9fa;
        }
        
        .action-remove {
          color: #e74c3c;
          border-color: #e74c3c;
        }
        
        .action-remove:hover {
          background-color: rgba(231, 76, 60, 0.05);
        }
        
        .activities-table-container {
          padding: 0;
          overflow-x: auto;
        }
        
        .activities-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .activities-table th {
          text-align: left;
          padding: 10px 15px;
          font-size: 13px;
          color: #7f8c8d;
          font-weight: 500;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .activities-table-name {
          width: 40%;
        }
        
        .activities-table-category {
          width: 20%;
        }
        
        .activities-table-hours {
          width: 30%;
        }
        
        .activities-table-actions {
          width: 10%;
        }
        
        .activity-row {
          border-bottom: 1px solid #f0f0f0;
        }
        
        .activity-row:last-child {
          border-bottom: none;
        }
        
        .activity-name-cell {
          padding: 12px 15px;
        }
        
        .activity-name {
          font-weight: 500;
          font-size: 14px;
          color: #34495e;
          margin-bottom: 3px;
        }
        
        .activity-description {
          font-size: 12px;
          color: #7f8c8d;
        }
        
        .activity-category-cell {
          padding: 12px 15px;
        }
        
        .activity-category-tag {
          background-color: rgba(52, 152, 219, 0.1);
          color: #3498db;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .activity-hours-cell {
          padding: 12px 15px;
          font-weight: 500;
          color: #34495e;
        }
        
        .activity-quantity-container {
          display: flex;
          align-items: center;
        }
        
        .quantity-control {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        
        .quantity-input {
          width: 50px;
          padding: 4px 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
        }
        
        .quantity-unit {
          color: #7f8c8d;
        }
        
        .total-hours {
          font-weight: 600;
          color: #3498db;
        }
        
        .activity-actions-cell {
          padding: 12px 15px;
          text-align: right;
        }
        
        .activity-remove-button {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: #e74c3c;
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          cursor: pointer;
          padding: 0;
          margin-left: auto;
        }
        
        .activity-selector {
          background-color: #f8f9fa;
          border-top: 1px solid #e1e4e8;
          padding: 15px;
        }
        
        .activity-selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .activity-selector-header h4 {
          font-size: 16px;
          font-weight: 500;
          color: #34495e;
          margin: 0;
        }
        
        .activity-search {
          width: 250px;
          position: relative;
        }
        
        .activity-categories {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .activity-category {
          margin-bottom: 15px;
        }
        
        .category-name {
          font-size: 14px;
          font-weight: 500;
          color: #7f8c8d;
          margin: 0 0 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #ecf0f1;
        }
        
        .category-activities {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 10px;
        }
        
        .activity-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .activity-option:hover {
          border-color: #3498db;
        }
        
        .activity-option-info {
          flex-grow: 1;
        }
        
        .activity-option-title {
          font-weight: 500;
          font-size: 14px;
          color: #34495e;
          margin-bottom: 3px;
        }
        
        .activity-option-hours {
          font-size: 12px;
          color: #7f8c8d;
        }
        
        .activity-button {
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 12px;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }
        
        .activity-button-add {
          background-color: #3498db;
          color: white;
        }
        
        .activity-button-add:hover {
          background-color: #2980b9;
        }
        
        .activity-button-disabled {
          background-color: #ecf0f1;
          color: #95a5a6;
          cursor: default;
        }
        
        .activity-button-add-all {
            background-color: #3498db;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 500;
            font-size: 13px;
            cursor: pointer;
            border: none;
            white-space: nowrap;
            margin-left: 10px;
        }

        .activity-button-add-all:hover {
            background-color: #2980b9;
        }

        .no-activities {
          padding: 20px;
          text-align: center;
          color: #7f8c8d;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 200px;
          text-align: center;
          color: #95a5a6;
          padding: 20px;
          border: 2px dashed #ecf0f1;
          border-radius: 4px;
          margin: 12px;
        }
        
        .empty-state p {
          margin: 5px 0;
        }
        
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: white;
          padding: 15px 20px;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .stats {
          display: flex;
          gap: 40px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 3px;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #3498db;
        }
        
        .actions {
          display: flex;
          gap: 10px;
        }
        
        .action-secondary {
          background-color: white;
          border: 1px solid #3498db;
          color: #3498db;
        }
        
        .action-secondary:hover {
          background-color: rgba(52, 152, 219, 0.05);
        }
        
        .action-primary {
          background-color: #3498db;
          color: white;
          border: 1px solid #3498db;
        }
        
        .action-primary:hover {
          background-color: #2980b9;
        }
        
        .action-primary:disabled {
          background-color: #bdc3c7;
          border-color: #bdc3c7;
          cursor: default;
        }
      `}</style>
        </div>
    );
};

export default BlocksSelectionScreen;