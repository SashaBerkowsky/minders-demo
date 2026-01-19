import { safeParse } from 'valibot';
import { ConfigSchema } from './domain/validation';
import { FetchFeedbackRepository } from './infrastructure/http/fetchAdapter';
import { LocalUserStorageAdapter } from './infrastructure/storage/userAdapter';
import { SubmitFeedbackUseCase } from './application/submitFeedback';
import { FeedbackWidget } from './infrastructure/widget';

class FeedbackSDK {
  static init(rawConfig: unknown) {
    const configResult = safeParse(ConfigSchema, rawConfig);

    if (!configResult.success) {
      console.error(
        '[FeedbackSDK] Configuración inválida:',
        configResult.issues,
      );
      return;
    }

    const config = configResult.output;
    const repository = new FetchFeedbackRepository();
    const storage = new LocalUserStorageAdapter();

    const submitUseCase = new SubmitFeedbackUseCase(
      repository,
      storage,
      config,
    );

    const widget = new FeedbackWidget(submitUseCase, config);
    widget.init();

    console.log('[FeedbackSDK] Inicializado correctamente');
  }
}

(window as any).FeedbackSDK = FeedbackSDK;

export { FeedbackSDK };
