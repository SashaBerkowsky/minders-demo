import type { SDKConfig } from '../../domain';
import type { ErrorKey } from './errors';
import { ICONS } from './icons';
import { FeedbackSchema } from '../../domain/validation';
import { SubmitFeedbackUseCase } from '../../application/submitFeedback.ts';
import { getFeedbackTemplate } from './template';
import { getErrorMessageKey, getErrorMessage } from './errors';
import { componentStyles } from './styles';
import { safeParse } from 'valibot';

export class FeedbackWidget {
  private root: ShadowRoot;
  private isOpen = false;
  private rating = 0;

  private readonly submitFeedbackUC: SubmitFeedbackUseCase;
  private readonly config: SDKConfig;

  constructor(useCase: SubmitFeedbackUseCase, config: SDKConfig) {
    const host = document.createElement('div');
    document.body.appendChild(host);
    this.root = host.attachShadow({ mode: 'open' });
    this.submitFeedbackUC = useCase;
    this.config = config;
  }

  init() {
    this.render();
    this.applyTheme();
    this.bindEvents();
  }

  private applyTheme() {
    const theme = this.config.theme;
    if (!theme) return;
    const container = this.root.querySelector(
      '.widget-container',
    ) as HTMLElement;

    const mappings: Record<string, string> = {
      primaryColor: '--fdbk-primary',
      backgroundColor: '--fdbk-bg',
      textColor: '--fdbk-text',
      borderColor: '--fdbk-border',
      inputBackgroundColor: '--fdbk-input-bg',
      submitColor: '--fdbk-submit-bg',
    };

    Object.keys(mappings).forEach((key) => {
      // @ts-ignore
      if (theme[key]) {
        // @ts-ignore
        container.style.setProperty(mappings[key], theme[key]);
      }
    });
  }

  private render() {
    const style = document.createElement('style');
    style.textContent = componentStyles;
    this.root.appendChild(style);

    const container = document.createElement('div');
    container.className = 'widget-container';
    container.innerHTML = getFeedbackTemplate();

    this.root.appendChild(container);
  }

  private bindEvents() {
    const triggerBtn = this.root.getElementById('trigger');
    const modal = this.root.getElementById('modal');
    const stars = this.root.querySelectorAll('.star');
    const submitBtn = this.root.getElementById('submit');
    const retryBtn = this.root.getElementById('retry');
    const cancelBtn = this.root.getElementById('cancel');

    triggerBtn?.addEventListener('click', () => {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        modal?.classList.add('open');
        triggerBtn.innerHTML = ICONS.close;
      } else {
        modal?.classList.remove('open');
        triggerBtn.innerHTML = ICONS.chat;
      }
    });

    stars.forEach((star) => {
      star.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        this.rating = parseInt(target.dataset.value || '0');
        this.updateStars(stars, this.rating);
        this.clearValidationErrors();
      });

      star.addEventListener('mouseenter', (e) => {
        const target = e.currentTarget as HTMLElement;
        const rating = parseInt(target.dataset.value || '0');
        this.updateStars(stars, rating);
      });

      star.addEventListener('mouseleave', () =>
        this.updateStars(stars, this.rating),
      );
    });

    const commentEl = this.root.getElementById(
      'comment',
    ) as HTMLTextAreaElement;
    commentEl.addEventListener('input', () => {
      this.clearValidationErrors();
    });

    const handleSubmit = async (): Promise<void> => {
      const comment = (
        this.root.querySelector('#comment') as HTMLTextAreaElement
      ).value;

      const validation = this.validateForm(this.rating, comment);
      if (!validation.isValid) {
        this.showValidationErrors(validation.errors);
        return;
      }

      this.clearValidationErrors();
      this.toggleLoading(true);
      try {
        const feedback = await this.submitFeedbackUC.execute(
          this.rating,
          comment,
        );
        this.toggleSuccessView(true);
        if (this.config.onSuccess) {
          this.config.onSuccess(feedback);
        }
      } catch (e: any) {
        const errorMessageKey = getErrorMessageKey(e);
        this.toggleErrorView(true, errorMessageKey);
        if (this.config.debug) {
          console.error('FeedbackSDK Error:', e);
        }
        if (this.config.onError) {
          this.config.onError(e.message);
        }
      } finally {
        this.toggleLoading(false);
      }
    };

    submitBtn?.addEventListener('click', handleSubmit);
    retryBtn?.addEventListener('click', handleSubmit);

    cancelBtn?.addEventListener('click', () => {
      this.toggleErrorView(false);
    });
  }

  private updateStars(stars: NodeListOf<Element>, rating: number) {
    stars.forEach((star) => {
      const s = star as HTMLElement;
      const val = parseInt(s.dataset.value || '0');
      if (val <= rating) s.classList.add('active');
      else s.classList.remove('active');
    });
  }

  private toggleLoading(isLoading: boolean) {
    const submitBtn = this.root.querySelector('#submit') as HTMLButtonElement;
    const retryBtn = this.root.querySelector('#retry') as HTMLButtonElement;

    if (!submitBtn || !retryBtn) return;

    if (isLoading) {
      submitBtn.textContent = '...';
      submitBtn.disabled = true;
      retryBtn.textContent = '...';
      retryBtn.disabled = true;
    } else {
      submitBtn.textContent = 'Submit';
      submitBtn.disabled = false;
      retryBtn.innerHTML = `${ICONS.refresh} Try again`;
      retryBtn.disabled = false;
    }
  }

  private toggleErrorView(show: boolean, messageKey?: ErrorKey): void {
    const form = this.root.querySelector('#view-form');
    const error = this.root.querySelector('#view-error');
    if (show) {
      form?.classList.add('hidden');
      error?.classList.remove('hidden');
      if (messageKey) {
        const msgEl = this.root.querySelector('#error-message');
        if (msgEl) msgEl.textContent = getErrorMessage(messageKey);
      }
    } else {
      error?.classList.add('hidden');
      form?.classList.remove('hidden');
    }
  }

  private toggleSuccessView(show: boolean): void {
    const form = this.root.querySelector('#view-form');
    const success = this.root.querySelector('#view-success');
    if (show) {
      form?.classList.add('hidden');
      success?.classList.remove('hidden');
    } else {
      success?.classList.add('hidden');
      form?.classList.remove('hidden');
    }
  }

  private validateForm(
    rating: number,
    comment: string,
  ): { isValid: boolean; errors: { rating?: string; comment?: string } } {
    const rawFeedback = {
      projectId: this.config.projectId,
      userId: 'dummy',
      rating,
      comment,
      deviceInfo: { userAgent: '', url: '' },
      timestamp: '',
    };
    const result = safeParse(FeedbackSchema, rawFeedback);
    const errors: { rating?: string; comment?: string } = {};
    if (!result.success) {
      for (const issue of result.issues) {
        const pathItem = issue.path?.[0];
        if (pathItem && typeof pathItem === 'object' && 'key' in pathItem) {
          const field = pathItem.key;
          if (field === 'rating') {
            errors.rating = 'Rating must be between 1 and 5.';
          } else if (field === 'comment') {
            errors.comment = 'Comment is too long (max 1000 characters).';
          }
        }
      }
    }
    return { isValid: result.success, errors };
  }

  private showValidationErrors(errors: {
    rating?: string;
    comment?: string;
  }): void {
    const ratingErrorEl = this.root.querySelector<HTMLElement>('#rating-error');
    const commentErrorEl =
      this.root.querySelector<HTMLElement>('#comment-error');
    if (ratingErrorEl) {
      ratingErrorEl.textContent = errors.rating || '';
      ratingErrorEl.style.display = errors.rating ? 'block' : 'none';
    }

    if (commentErrorEl) {
      commentErrorEl.textContent = errors.comment || '';
      commentErrorEl.style.display = errors.comment ? 'block' : 'none';
    }
  }

  private clearValidationErrors(): void {
    this.showValidationErrors({});
    const ratingErrorEl = this.root.querySelector<HTMLElement>('#rating-error');
    const commentErrorEl =
      this.root.querySelector<HTMLElement>('#comment-error');
    if (ratingErrorEl) ratingErrorEl.style.display = 'none';
    if (commentErrorEl) commentErrorEl.style.display = 'none';
  }
}
