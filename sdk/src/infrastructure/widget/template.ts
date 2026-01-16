import { ICONS } from './icons'

const renderStars = (): string => {
    return [1, 2, 3, 4, 5]
        .map(i => `<span class="star" data-value="${i}">${ICONS.star}</span>`)
        .join("")
}

export const getFeedbackTemplate = (): string => `
    <div class="modal" id="modal">
        <div id="view-form" class="view-section">
            <h3>Tu opinión</h3>
            <div class="stars" id="stars-container">${renderStars()}</div>
            <textarea id="comment" placeholder="Comentario..."></textarea>
            <button id="submit" class="submit-btn">Enviar</button>
        </div>
        <div id="view-error" class="view-section hidden error-view">
            ${ICONS.alert}
            <p>Error al enviar</p>
            <button id="retry" class="retry-btn">${ICONS.refresh} Reintentar</button>
            <button id="cancel" class="cancel-link">Cancelar</button>
        </div>
    </div>
    <button id="trigger" class="trigger-btn">${ICONS.chat}</button>
`
