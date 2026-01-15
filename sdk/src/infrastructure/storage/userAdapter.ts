import type { UserStorage } from '../../application/ports'

export class LocalUserStorageAdapter implements UserStorage {
    private readonly USER_KEY = "fdbk_user_id";
    private readonly SPAM_KEY = "fdbk_last_sent";

    getUserId(): string {
        let id = localStorage.getItem(this.USER_KEY)
        if (!id) {
            id = crypto.randomUUID()
            localStorage.setItem(this.USER_KEY, id)
        }
        return id
    }

    recordSubmission(): void {
        localStorage.setItem(this.SPAM_KEY, Date.now().toString())
    }
}
