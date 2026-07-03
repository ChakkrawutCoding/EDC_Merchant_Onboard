import { openDB } from "idb";

import type { FormData as OnboardingFormData } from "@/types/form";

const DB_NAME = "edc-onboarding-db";
const DB_VERSION = 1;
const STORE_NAME = "drafts";

export function getOnboardingDraftId(cognitoSub: string) {
    return `user:${cognitoSub}:current`;
}

export type OnboardingDraft = {
    id: string;
    currentStep: number;
    formData: OnboardingFormData;
    savedAt: string;
};

async function getDraftDb() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                });
            }
        },
    });
}

export async function saveOnboardingDraft(
    draftId: string,
    draft: Omit<OnboardingDraft, "id">
) {
    const db = await getDraftDb();

    await db.put(STORE_NAME, {
        id: draftId,
        ...draft,
    });
}

export async function getOnboardingDraft(draftId: string) {
    const db = await getDraftDb();

    return db.get(STORE_NAME, draftId) as Promise<
        OnboardingDraft | undefined
    >;
}

export async function clearOnboardingDraft(draftId: string) {
    const db = await getDraftDb();

    await db.delete(STORE_NAME, draftId);
}
