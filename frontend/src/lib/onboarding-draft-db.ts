import { openDB } from "idb";

import type { FormData as OnboardingFormData } from "@/types/form";

const DB_NAME = "edc-onboarding-db";
const DB_VERSION = 1;
const STORE_NAME = "drafts";
const DRAFT_ID = "current";

export type OnboardingDraft = {
    id: typeof DRAFT_ID;
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
    draft: Omit<OnboardingDraft, "id">
) {
    const db = await getDraftDb();

    await db.put(STORE_NAME, {
        id: DRAFT_ID,
        ...draft,
    });
}

export async function getOnboardingDraft() {
    const db = await getDraftDb();

    return db.get(STORE_NAME, DRAFT_ID) as Promise<
        OnboardingDraft | undefined
    >;
}

export async function clearOnboardingDraft() {
    const db = await getDraftDb();

    await db.delete(STORE_NAME, DRAFT_ID);
}