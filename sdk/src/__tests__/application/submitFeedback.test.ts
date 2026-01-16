import { describe, it, expect, vi, beforeEach } from "vitest";
import { SubmitFeedbackUseCase } from "../../application/submitFeedback";
import type { FeedbackRepository, UserStorage } from "../../application/ports";
import type { SDKConfig } from "../../domain/validation";

describe("SubmitFeedbackUseCase", () => {
    let mockRepository: FeedbackRepository;
    let mockStorage: UserStorage;
    let config: SDKConfig;
    let useCase: SubmitFeedbackUseCase;

    beforeEach(() => {
        mockRepository = {
            send: vi.fn(),
        };
        mockStorage = {
            getUserId: vi.fn().mockReturnValue("user-123"),
            recordSubmission: vi.fn(),
        };
        config = {
            projectId: "test-project",
            apiKey: "test-key",
        };
        useCase = new SubmitFeedbackUseCase(mockRepository, mockStorage, config);
    });

    it("should submit feedback successfully", async () => {
        const result = await useCase.execute(5, "Great!");

        expect(result).toMatchObject({
            userId: "user-123",
            rating: 5,
            comment: "Great!",
        })
        expect(mockRepository.send).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: "user-123",
                rating: 5,
                comment: "Great!",
            }),
            "https://api.default.com/feedback",
            "test-key",
            "test-project"
        );
        expect(mockStorage.recordSubmission).toHaveBeenCalled();
    });

    it("should throw validation error for invalid rating", async () => {
        await expect(useCase.execute(6, "")).rejects.toThrow("VALIDATION_ERROR");
        expect(mockRepository.send).not.toHaveBeenCalled();
    });

    it("should use custom apiEndpoint", async () => {
        config.apiEndpoint = "https://custom.com/api";
        useCase = new SubmitFeedbackUseCase(mockRepository, mockStorage, config);

        await useCase.execute(4, "");

        expect(mockRepository.send).toHaveBeenCalledWith(
            expect.any(Object),
            "https://custom.com/api",
            "test-key",
            "test-project"
        );
    });
});
