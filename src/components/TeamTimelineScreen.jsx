import React, { useState, useEffect, useRef } from 'react';

const TeamTimelineScreen = ({ onNext, onPrevious, projectData, updateProjectData }) => {
    // Reference to the timeline container for drag-and-drop operations
    const timelineRef = useRef(null);

    // State for team members
    const [teamMembers, setTeamMembers] = useState({
        CE: { title: 'Cloud Engineer', quantity: 1, hoursPerWeek: 40, efficiency: 1.0, color: '#fffacd' },
        DE: { title: 'Data Engineer', quantity: 3, hoursPerWeek: 40, efficiency: 1.0, color: '#e6f7ff' },
        DA: { title: 'Data Analyst', quantity: 1, hoursPerWeek: 40, efficiency: 1.0, color: '#f0fff0' },
        AI: { title: 'AI Engineer', quantity: 1, hoursPerWeek: 40, efficiency: 1.0, color: '#fff0f5' }
    });

    // Project blocks data (from previous screen or initial state)
    const [blocks, setBlocks] = useState([
        {
            id: 'foundations',
            title: 'Foundations',
            totalHours: 168,
            category: 'cloud',
            assignedTo: 'CE',
            position: { week: 0, duration: 0 }, // Week starting position and duration in weeks
            placed: false // Whether the block has been placed on the timeline
        },
        {
            id: 'camada_raw',
            title: 'Camada RAW',
            totalHours: 120,
            category: 'data',
            assignedTo: 'DE',
            position: { week: 0, duration: 0 },
            placed: false
        },
        {
            id: 'camada_bronze',
            title: 'Camada Bronze',
            totalHours: 40,
            category: 'data',
            assignedTo: 'DE',
            position: { week: 0, duration: 0 },
            placed: false
        },
        {
            id: 'camada_silver',
            title: 'Camada Silver',
            totalHours: 240,
            category: 'data',
            assignedTo: 'DE',
            position: { week: 0, duration: 0 },
            placed: false
        },
        {
            id: 'camada_gold',
            title: 'Camada Gold',
            totalHours: 320,
            category: 'data',
            assignedTo: 'DE',
            position: { week: 0, duration: 0 },
            placed: false
        },
        {
            id: 'looker',
            title: 'Looker',
            totalHours: 300,
            category: 'analytics',
            assignedTo: 'DA',
            position: { week: 0, duration: 0 },
            placed: false
        },
        {
            id: 'ai_engineering',
            title: 'AI Engineering',
            totalHours: 300,
            category: 'ai',
            assignedTo: 'AI',
            position: { week: 0, duration: 0 },
            placed: false
        }
    ]);

    // Timeline state
    const [timeline, setTimeline] = useState({
        weeks: 12, // Initial number of weeks 
        cells: [], // Will store the timeline grid data
        weeklyTotals: [] // Total hours per week
    });

    // Calculate the capacity for each role based on quantity and hours
    const calculateCapacity = () => {
        const capacity = {};

        Object.entries(teamMembers).forEach(([role, data]) => {
            capacity[role] = data.quantity * data.hoursPerWeek * data.efficiency;
        });

        return capacity;
    };

    // Get calculated work hours for a block
    const getCalculatedWorkHours = (block) => {
        const roleCapacity = calculateCapacity()[block.assignedTo] || 40;

        // Calculate how many full weeks are needed
        const weeksNeeded = Math.ceil(block.totalHours / roleCapacity);

        // Calculate how many full weeks of work will be used
        const fullCapacityHours = weeksNeeded * roleCapacity;

        // Calculate any overflow (extra capacity beyond what's needed)
        const overflow = fullCapacityHours - block.totalHours;

        // For display, calculate how many complete weeks and remaining hours
        const completeWeeks = Math.floor(block.totalHours / roleCapacity);
        const remainingHours = block.totalHours % roleCapacity;

        return {
            weeks: weeksNeeded,
            capacity: roleCapacity,
            calculatedHours: fullCapacityHours,
            overflow: overflow,
            completeWeeks: completeWeeks,
            remainingHours: remainingHours
        };
    };

    // Get total hours for a role
    const getRoleHours = (roleId) => {
        return blocks
            .filter(block => block.assignedTo === roleId)
            .reduce((sum, block) => sum + block.totalHours, 0);
    };

    // Calculate block durations based on team capacity
    const calculateBlockDurations = () => {
        const capacity = calculateCapacity();

        return blocks.map(block => {
            const roleCapacity = capacity[block.assignedTo] || 40; // Default to 40 if not assigned

            // Always allocate full weeks with full capacity
            // Duration = ceiling of (total hours / weekly capacity)
            const duration = Math.ceil(block.totalHours / roleCapacity);

            return {
                ...block,
                position: { ...block.position, duration }
            };
        });
    };

    // Initialize timeline calculations
    useEffect(() => {
        const updatedBlocks = calculateBlockDurations();
        setBlocks(updatedBlocks);
        generateTimelineGrid(updatedBlocks);
    }, [teamMembers]);

    // Generate the timeline grid data
    const generateTimelineGrid = (blockList = blocks) => {
        // Determine how many weeks we need based on placed blocks
        let maxWeek = timeline.weeks;
        blockList.forEach(block => {
            if (block.placed) {
                const blockEndWeek = block.position.week + block.position.duration;
                maxWeek = Math.max(maxWeek, blockEndWeek);
            }
        });

        // Create cells array and weekly totals
        const cells = [];
        const weeklyTotals = Array(maxWeek).fill(0);

        // Calculate hours per cell for each block and week
        blockList.forEach(block => {
            if (block.placed) {
                const startWeek = block.position.week;
                const duration = block.position.duration;
                const roleCapacity = calculateCapacity()[block.assignedTo] || 40;
                let remainingHours = block.totalHours;

                // Distribute hours across weeks - use full capacity until the last week
                for (let w = 0; w < duration && remainingHours > 0; w++) {
                    const weekIndex = startWeek + w;
                    if (weekIndex < maxWeek) {
                        // Allocate up to the role capacity, or remaining hours if less
                        const hoursThisWeek = Math.min(roleCapacity, remainingHours);

                        if (hoursThisWeek > 0) {
                            cells.push({
                                blockId: block.id,
                                week: weekIndex,
                                hours: hoursThisWeek
                            });

                            weeklyTotals[weekIndex] += hoursThisWeek;
                            remainingHours -= hoursThisWeek;
                        }
                    }
                }
            }
        });

        setTimeline({
            weeks: maxWeek,
            cells,
            weeklyTotals
        });
    };

    // Handle team member quantity change
    const handleQuantityChange = (roleId, value) => {
        const newValue = parseInt(value, 10) || 0;

        setTeamMembers(prev => ({
            ...prev,
            [roleId]: {
                ...prev[roleId],
                quantity: newValue
            }
        }));

        // Blocks will be updated via useEffect
    };

    // Drag-and-drop functionality for blocks
    const [draggedBlock, setDraggedBlock] = useState(null);

    const handleDragStart = (e, blockId) => {
        setDraggedBlock(blockId);
        e.dataTransfer.setData('blockId', blockId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, week) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, weekIndex) => {
        e.preventDefault();
        const blockId = e.dataTransfer.getData('blockId');

        setBlocks(prevBlocks => {
            const updatedBlocks = prevBlocks.map(block => {
                if (block.id === blockId) {
                    // Check if this would cause overlap with any other block
                    // For simplicity we're just allowing all moves, but you could add
                    // validation logic here to prevent overlapping blocks of the same role

                    return {
                        ...block,
                        position: { ...block.position, week: weekIndex },
                        placed: true
                    };
                }
                return block;
            });

            // Update timeline after modifying blocks
            setTimeout(() => generateTimelineGrid(updatedBlocks), 0);
            return updatedBlocks;
        });
    };

    // Remove a block from timeline
    const removeFromTimeline = (blockId) => {
        setBlocks(prevBlocks => {
            const updatedBlocks = prevBlocks.map(block => {
                if (block.id === blockId) {
                    return {
                        ...block,
                        position: { ...block.position, week: 0 },
                        placed: false
                    };
                }
                return block;
            });

            // Update timeline after modifying blocks
            setTimeout(() => generateTimelineGrid(updatedBlocks), 0);
            return updatedBlocks;
        });
    };

    // Format numbers with thousands separator
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Get cells for a specific block and week
    const getCellsForBlockAndWeek = (blockId, week) => {
        return timeline.cells.filter(cell =>
            cell.blockId === blockId && cell.week === week
        );
    };

    // Calculate total project hours
    const getTotalProjectHours = () => {
        return blocks.reduce((sum, block) => sum + block.totalHours, 0);
    };

    // Get hours allocated for a specific week
    const getWeeklyTotalHours = (week) => {
        return timeline.weeklyTotals[week] || 0;
    };

    // Check if a specific week has content for a block
    const hasContentInWeek = (blockId, week) => {
        const cells = getCellsForBlockAndWeek(blockId, week);
        return cells.length > 0 && cells[0].hours > 0;
    };

    // Get hours for a block in a specific week
    const getHoursInWeek = (blockId, week) => {
        const cells = getCellsForBlockAndWeek(blockId, week);
        return cells.length > 0 ? cells[0].hours : 0;
    };

    // Add a week to the timeline
    const addWeek = () => {
        setTimeline(prev => ({
            ...prev,
            weeks: prev.weeks + 1,
            weeklyTotals: [...prev.weeklyTotals, 0]
        }));
    };

    // Save timeline data before proceeding to next screen
    const handleNext = () => {
        updateProjectData({
            ...projectData,
            timeline: {
                blocks,
                teamMembers,
                timeline
            }
        });
        onNext();
    };

    return (
        <div className="screen">
            <h2 className="screen-title">Time e Cronograma Dinâmico</h2>

            <div className="main-layout">
                {/* LEFT PANEL: TEAM CONFIG AND UNPLACED BLOCKS */}
                <div className="left-panel">
                    <div className="card team-card">
                        <h3 className="card-title">Configuração da Equipe</h3>
                        <p className="card-subtitle">Ajuste o time para otimizar o cronograma</p>

                        <div className="team-config">
                            {Object.entries(teamMembers).map(([roleId, data]) => (
                                <div key={roleId} className={`profile-card profile-${roleId.toLowerCase()}`}>
                                    <div className="profile-header">
                                        <div className="profile-title">{roleId}: {data.title}</div>
                                        <div className="profile-hours">{getRoleHours(roleId)}h total</div>
                                    </div>

                                    <div className="profile-details">
                                        <div className="profile-info">
                                            <span>{data.hoursPerWeek}h semanais por pessoa</span>
                                            <span>Capacidade da equipe: {data.quantity * data.hoursPerWeek}h por semana</span>
                                            <span>Eficiência: {data.efficiency}x</span>
                                        </div>

                                        <div className="profile-quantity">
                                            <label>Quantidade:</label>
                                            <select
                                                value={data.quantity}
                                                onChange={(e) => handleQuantityChange(roleId, e.target.value)}
                                            >
                                                {[0, 1, 2, 3, 4, 5].map(num => (
                                                    <option key={num} value={num}>{num}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="card-title blocks-title">Blocos Disponíveis</h3>
                        <p className="card-subtitle">Arraste para o cronograma à direita</p>

                        <div className="unplaced-blocks">
                            {blocks.filter(block => !block.placed).map(block => {
                                const workHours = getCalculatedWorkHours(block);
                                return (
                                    <div
                                        key={block.id}
                                        className={`block-item profile-${block.assignedTo.toLowerCase()}`}
                                        draggable="true"
                                        onDragStart={(e) => handleDragStart(e, block.id)}
                                    >
                                        <div className="block-details">
                                            <div className="block-title">{block.title}</div>
                                            <div className="block-info">
                                                <span className="block-hours">{block.totalHours}h necessárias</span>
                                                <div className="block-calculation">
                                                    <span>
                                                        Alocação: {workHours.weeks} {workHours.weeks === 1 ? 'semana' : 'semanas'} × {workHours.capacity}h = {workHours.calculatedHours}h
                                                    </span>
                                                    {workHours.overflow > 0 && (
                                                        <span className="overflow-warning">
                                                            (+{workHours.overflow}h excedente)
                                                        </span>
                                                    )}
                                                    {workHours.completeWeeks > 0 && workHours.remainingHours > 0 && (
                                                        <span className="detailed-allocation">
                                                            Detalhado: {workHours.completeWeeks} {workHours.completeWeeks === 1 ? 'semana' : 'semanas'} completa{workHours.completeWeeks > 1 ? 's' : ''} + {workHours.remainingHours}h
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {blocks.filter(block => !block.placed).length === 0 && (
                                <div className="empty-blocks-message">
                                    Todos os blocos estão no cronograma
                                </div>
                            )}
                        </div>

                        <div className="actions">
                            <button className="btn btn-outline" onClick={onPrevious}>Voltar</button>
                            <button className="btn btn-primary" onClick={handleNext}>Próximo</button>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: TIMELINE */}
                <div className="right-panel">
                    <div className="card timeline-card">
                        <h3 className="card-title">Cronograma do Projeto</h3>
                        <p className="card-subtitle">Arraste e solte os blocos para montar o cronograma</p>

                        <div className="timeline-container" ref={timelineRef}>
                            <table className="timeline-table">
                                <thead>
                                    <tr>
                                        <th className="timeline-header-block">Bloco</th>
                                        <th className="timeline-header-hours">Horas</th>
                                        {Array.from({ length: timeline.weeks }).map((_, index) => (
                                            <th key={`week-${index}`} className="timeline-header-week">
                                                S{index + 1}
                                            </th>
                                        ))}
                                        <th className="timeline-header-actions">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Placed blocks */}
                                    {blocks.filter(block => block.placed).map(block => (
                                        <tr key={block.id} className="timeline-row">
                                            <td className="timeline-block-name">
                                                <span className={`block-label profile-${block.assignedTo.toLowerCase()}`}>
                                                    {block.title}
                                                </span>
                                            </td>
                                            <td className="timeline-block-hours">
                                                {block.totalHours}h
                                                <span className="duration-note">
                                                    ({block.position.duration} {block.position.duration === 1 ? 'semana' : 'semanas'})
                                                </span>
                                            </td>

                                            {Array.from({ length: timeline.weeks }).map((_, weekIndex) => {
                                                const isActive = weekIndex >= block.position.week &&
                                                    weekIndex < (block.position.week + block.position.duration);

                                                const isFirstWeek = weekIndex === block.position.week;
                                                const hours = getHoursInWeek(block.id, weekIndex);

                                                return (
                                                    <td
                                                        key={`cell-${block.id}-${weekIndex}`}
                                                        className={`timeline-cell ${isActive ? 'timeline-cell-active' : ''}`}
                                                        onDragOver={(e) => handleDragOver(e, weekIndex)}
                                                        onDrop={(e) => handleDrop(e, weekIndex)}
                                                    >
                                                        {isActive && (
                                                            <div
                                                                className={`timeline-block profile-${block.assignedTo.toLowerCase()} ${isFirstWeek ? 'draggable-block' : ''}`}
                                                                draggable={isFirstWeek}
                                                                onDragStart={isFirstWeek ? (e) => handleDragStart(e, block.id) : null}
                                                            >
                                                                {hours}h
                                                            </div>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            <td className="timeline-actions">
                                                <button
                                                    className="timeline-btn remove-btn"
                                                    onClick={() => removeFromTimeline(block.id)}
                                                >
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Empty row for dropping if no blocks are placed */}
                                    {blocks.filter(block => block.placed).length === 0 && (
                                        <tr className="timeline-row empty-row">
                                            <td colSpan={2} className="timeline-empty-message">
                                                Arraste blocos para montar o cronograma
                                            </td>
                                            {Array.from({ length: timeline.weeks }).map((_, weekIndex) => (
                                                <td
                                                    key={`empty-${weekIndex}`}
                                                    className="timeline-cell timeline-cell-empty"
                                                    onDragOver={(e) => handleDragOver(e, weekIndex)}
                                                    onDrop={(e) => handleDrop(e, weekIndex)}
                                                ></td>
                                            ))}
                                            <td></td>
                                        </tr>
                                    )}

                                    {/* Weekly totals row */}
                                    <tr className="timeline-totals-row">
                                        <td className="timeline-totals-label">Total por Semana</td>
                                        <td className="timeline-totals-hours">{getTotalProjectHours()}h</td>

                                        {Array.from({ length: timeline.weeks }).map((_, weekIndex) => (
                                            <td
                                                key={`total-${weekIndex}`}
                                                className="timeline-total-cell"
                                            >
                                                {getWeeklyTotalHours(weekIndex)}h
                                            </td>
                                        ))}

                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="timeline-controls">
                            <button className="btn btn-outline btn-sm" onClick={addWeek}>
                                + Adicionar Semana
                            </button>
                        </div>

                        <div className="timeline-legend">
                            <h4 className="legend-title">Legenda:</h4>
                            <div className="legend-items">
                                {Object.entries(teamMembers).map(([roleId, data]) => (
                                    <div key={roleId} className={`legend-item profile-${roleId.toLowerCase()}`}>
                                        {data.title} ({roleId})
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .screen {
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }
                
                .screen-title {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #333;
                }
                
                .main-layout {
                    display: flex;
                    gap: 20px;
                }
                
                .left-panel {
                    width: 35%;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                
                .right-panel {
                    width: 65%;
                }
                
                .card {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    padding: 20px;
                }
                
                .team-card {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .timeline-card {
                    height: 100%;
                }
                
                .card-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #4b39af;
                }
                
                .blocks-title {
                    margin-top: 20px;
                }
                
                .card-subtitle {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 15px;
                }
                
                .team-config {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .profile-card {
                    border-radius: 6px;
                    padding: 15px;
                }
                
                .profile-ce {
                    background-color: #fffacd;
                }
                
                .profile-de {
                    background-color: #e6f7ff;
                }
                
                .profile-da {
                    background-color: #f0fff0;
                }
                
                .profile-ai {
                    background-color: #fff0f5;
                }
                
                .profile-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                
                .profile-title {
                    font-weight: 600;
                    color: #333;
                }
                
                .profile-hours {
                    font-size: 14px;
                    color: #4b39af;
                    font-weight: 500;
                }
                
                .profile-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .profile-info {
                    display: flex;
                    flex-direction: column;
                    font-size: 12px;
                    color: #666;
                    gap: 2px;
                }
                
                .profile-quantity {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .profile-quantity select {
                    width: 60px;
                    padding: 5px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                .unplaced-blocks {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 20px;
                    min-height: 200px;
                    max-height: 300px;
                    overflow-y: auto;
                    padding: 10px;
                    border: 1px dashed #ccc;
                    border-radius: 6px;
                }
                
                .block-item {
                    padding: 12px;
                    border-radius: 6px;
                    cursor: grab;
                    transition: all 0.2s;
                }
                
                .block-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
                }
                
                .block-details {
                    display: flex;
                    flex-direction: column;
                }
                
                .block-title {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
                
                .block-info {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                
                .block-hours {
                    font-weight: 500;
                    font-size: 13px;
                    color: #333;
                }
                
                .block-calculation {
                    font-size: 12px;
                    color: #666;
                    display: flex;
                    flex-direction: column;
                }
                
                .overflow-warning {
                    color: #e67e22;
                    font-weight: 500;
                }
                
                .detailed-allocation {
                    font-size: 11px;
                    color: #666;
                    margin-top: 2px;
                }
                
                .empty-blocks-message {
                    text-align: center;
                    padding: 20px;
                    color: #999;
                    font-style: italic;
                }
                
                .actions {
                    display: flex;
                    gap: 10px;
                    margin-top: auto;
                }
                
                .btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    text-align: center;
                }
                
                .btn-sm {
                    padding: 8px 15px;
                    font-size: 13px;
                    flex: 0 auto;
                }
                
                .btn-primary {
                    background-color: #4b39af;
                    color: white;
                    border: none;
                }
                
                .btn-outline {
                    background-color: white;
                    color: #4b39af;
                    border: 1px solid #4b39af;
                }
                
                .timeline-container {
                    overflow-x: auto;
                    margin-bottom: 15px;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                }
                
                .timeline-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 800px;
                }
                
                .timeline-header-block,
                .timeline-header-hours,
                .timeline-header-week,
                .timeline-header-actions {
                    background-color: #4b39af;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-weight: 500;
                    font-size: 14px;
                }
                
                .timeline-header-block {
                    text-align: left;
                    width: 180px;
                }
                
                .timeline-header-hours {
                    width: 80px;
                }
                
                .timeline-header-week {
                    width: 70px;
                }
                
                .timeline-header-actions {
                    width: 60px;
                }
                
                .timeline-row {
                    border-bottom: 1px solid #e0e0e0;
                }
                
                .timeline-row:last-child {
                    border-bottom: none;
                }
                
                .timeline-block-name {
                    padding: 10px;
                    text-align: left;
                    font-weight: 500;
                }
                
                .block-label {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 13px;
                }
                
                .timeline-block-hours {
                    text-align: center;
                    padding: 10px;
                    font-weight: 500;
                }
                
                .duration-note {
                    display: block;
                    font-size: 11px;
                    color: #666;
                    font-weight: normal;
                }
                
                .timeline-cell {
                    padding: 5px;
                    text-align: center;
                    min-height: 45px;
                    vertical-align: middle;
                    position: relative;
                    border: 1px solid #eee;
                }
                
                .timeline-cell-active {
                    background-color: rgba(75, 57, 175, 0.05);
                }
                
                .timeline-cell-empty {
                    cursor: pointer;
                }
                
                .timeline-block {
                    padding: 4px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .draggable-block {
                    cursor: grab;
                    position: relative;
                }
                
                .draggable-block:hover {
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                }
                
                .draggable-block:hover::before {
                    content: '↔';
                    position: absolute;
                    left: -12px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    color: #666;
                }
                
                .timeline-actions {
                    text-align: center;
                    padding: 10px;
                }
                
                .timeline-btn {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                
                .remove-btn {
                    background-color: #e74c3c;
                    color: white;
                    font-size: 14px;
                }
                
                .timeline-empty-message {
                    text-align: center;
                    color: #999;
                    font-style: italic;
                    padding: 10px;
                }
                
                .timeline-totals-row {
                    background-color: #f7f9fc;
                    font-weight: 600;
                }
                
                .timeline-totals-label {
                    padding: 10px;
                    text-align: left;
                }
                
                .timeline-totals-hours,
                .timeline-total-cell {
                    padding: 10px;
                    text-align: center;
                }
                
                .timeline-controls {
                    display: flex;
                    justify-content: flex-end;
                    margin: 15px 0;
                }
                
                .timeline-legend {
                    margin-top: 20px;
                    border-top: 1px solid #eee;
                    padding-top: 15px;
                }
                
                .legend-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #555;
                }
                
                .legend-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }
                
                .legend-item {
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 13px;
                }
            `}</style>
        </div>
    );
};

export default TeamTimelineScreen;