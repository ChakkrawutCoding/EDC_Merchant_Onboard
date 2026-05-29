export type UploadedFile = {
    name: string;
    type: string;
    size: number;
    base64: string;
};

export type FormData = {
    businessName: string;
    businessType: string;
    otherBusinessType: string;
    taxId: string;
    tel: string;
    businessAddress: string;
    road: string;
    province: string;
    district: string;
    subDistrict: string;
    zipcode: string;

    companyCertificate: UploadedFile | null;
    citizenIdCard: UploadedFile | null;
    bankBook: UploadedFile | null;
};