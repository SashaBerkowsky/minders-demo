import type { SDKConfig } from '../../domain'
import { ICONS } from './icons'
import { SubmitFeedbackUseCase } from '../../application/submitFeedback.ts'
import { getFeedbackTemplate } from './template'
import { componentStyles } from './styles'

export class FeedbackWidget {
    private root: ShadowRoot
    private isOpen = false
    private rating = 0

    private readonly submitFeedbackUC: SubmitFeedbackUseCase
    private readonly config: SDKConfig

    constructor(useCase: SubmitFeedbackUseCase, config: SDKConfig) {
        const host = document.createElement("div")
        document.body.appendChild(host)
        this.root = host.attachShadow({ mode: "open" })
        this.submitFeedbackUC = useCase
        this.config = config
    }

    init() {
        this.render()
        this.applyTheme()
        this.bindEvents()
    }

    private applyTheme() {
        const theme = this.config.theme
        if (!theme) return
        const container = this.root.querySelector(
            ".widget-container",
        ) as HTMLElement;

        const mappings: Record<string, string> = {
            primaryColor: "--fdbk-primary",
            backgroundColor: "--fdbk-bg",
            textColor: "--fdbk-text",
            borderColor: "--fdbk-border",
            inputBackgroundColor: "--fdbk-input-bg",
        }

        Object.keys(mappings).forEach((key) => {
            // @ts-ignore
            if (theme[key]) {
                // @ts-ignore
                container.style.setProperty(mappings[key], theme[key]);
            }
        });
    }

    private render() {
        const style = document.createElement("style")
        style.textContent = componentStyles
        this.root.appendChild(style)

        const container = document.createElement("div")
        container.className = "widget-container"
        container.innerHTML = getFeedbackTemplate()

        this.root.appendChild(container)
    }

    private bindEvents() {
        const triggerBtn = this.root.getElementById("trigger")
        const modal = this.root.getElementById("modal")
        const stars = this.root.querySelectorAll(".star")
        const submitBtn = this.root.getElementById("submit")
        const retryBtn = this.root.getElementById("retry")
        const cancelBtn = this.root.getElementById("cancel")

        triggerBtn?.addEventListener("click", () => {
            this.isOpen = !this.isOpen

            if (this.isOpen) {
                modal?.classList.add("open")
                triggerBtn.innerHTML = ICONS.close
            } else {
                modal?.classList.remove("open")
                triggerBtn.innerHTML = ICONS.chat
            }
        })

        stars.forEach((star) => {
            star.addEventListener("click", e => {
                const target = e.currentTarget as HTMLElement
                this.rating = parseInt(target.dataset.value || "0")
                this.updateStars(stars, this.rating)
            })

            star.addEventListener("mouseenter", e => {
                const target = e.currentTarget as HTMLElement
                const rating = parseInt(target.dataset.value || "0")
                this.updateStars(stars, rating)
            })

            star.addEventListener("mouseleave", () => {
                this.updateStars(stars, this.rating)
            })
        })

        const handleSubmit = async () => {
            const comment = (
                this.root.getElementById("comment") as HTMLTextAreaElement
            ).value

            this.toggleLoading(true)
            try {
                await this.submitFeedbackUC.execute(this.rating, comment)
                alert("Gracias por tu feedback!")
                this.closeModal()
            } catch (e: any) {
                if (e.message === "RATE_LIMIT_EXCEEDED") {
                    alert("Por favor espera un momento antes de enviar otro.")
                } else {
                    console.error(e)
                    this.toggleErrorView(true)
                }
            } finally {
                this.toggleLoading(false)
            }
        }

        submitBtn?.addEventListener("click", handleSubmit)
        retryBtn?.addEventListener("click", handleSubmit)

        cancelBtn?.addEventListener("click", () => {
            this.toggleErrorView(false)
        })
    }

    private updateStars(stars: NodeListOf<Element>, rating: number) {
        stars.forEach((star) => {
            const s = star as HTMLElement
            const val = parseInt(s.dataset.value || "0")
            if (val <= rating) s.classList.add("active")
            else s.classList.remove("active")
        })
    }

    private toggleLoading(isLoading: boolean) {
        const submitBtn = this.root.getElementById("submit") as HTMLButtonElement
        const retryBtn = this.root.getElementById("retry") as HTMLButtonElement

        if (!submitBtn || !retryBtn) return

        if (isLoading) {
            submitBtn.textContent = "..."
            submitBtn.disabled = true
            retryBtn.textContent = "..."
            retryBtn.disabled = true
        } else {
            submitBtn.textContent = "Enviar"
            submitBtn.disabled = false
            retryBtn.innerHTML = `${ICONS.refresh} Reintentar`
            retryBtn.disabled = false
        }
    }

    private toggleErrorView(show: boolean) {
        const form = this.root.getElementById("view-form")
        const error = this.root.getElementById("view-error")
        if (show) {
            form?.classList.add("hidden")
            error?.classList.remove("hidden")
        } else {
            error?.classList.add("hidden")
            form?.classList.remove("hidden")
        }
    }

    private closeModal() {
        this.isOpen = false
        this.root.getElementById("modal")?.classList.remove("open")

        const trigger = this.root.getElementById("trigger")
        if (trigger) trigger.innerHTML = ICONS.chat

        const input = this.root.getElementById("comment") as HTMLTextAreaElement
        if (input) input.value = ""
        this.rating = 0
        this.updateStars(this.root.querySelectorAll(".star"), 0)
    }
}
