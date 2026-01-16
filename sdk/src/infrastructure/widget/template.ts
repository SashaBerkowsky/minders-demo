import { ICONS } from './icons'

const renderStars = (): string => {
    return [1, 2, 3, 4, 5]
        .map(i => `<span class="star" data-value="${i}">${ICONS.star}</span>`)
        .join("")
}

export const getFeedbackTemplate = (): string => `
      <div class="modal" id="modal">
        <div id="view-form" class="view-section">
            <h3>Your feedback</h3>
            <div class="stars" id="stars-container">${renderStars()}</div>
            <div class="error" id="rating-error"></div>
            <textarea id="comment" placeholder="Comment..."></textarea>
            <div class="error" id="comment-error"></div>
            <button id="submit" class="submit-btn">Submit</button>
        </div>
        <div id="view-error" class="view-section hidden error-view">
            ${ICONS.alert}
            <p id="error-message">Connection failed. Please try again.</p>
            <button id="retry" class="retry-btn">${ICONS.refresh} Try again</button>
            <button id="cancel" class="cancel-link">Cancel</button>
        </div>
        <div id="view-success" class="view-section hidden success-view">
            ${ICONS.check}
            <p>Feedback sent successfully!</p>
        </div>
        <div id="view-rate-limit" class="view-section hidden rate-limit-view">
            ${ICONS.warning}
            <button id="rate-limit-ok" class="cancel-link">Cancel</button>
        </div>
      </div>
      <button id="trigger" class="trigger-btn">${ICONS.chat}</button>
`
