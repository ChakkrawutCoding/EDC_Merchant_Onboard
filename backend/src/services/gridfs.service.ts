import mongoose, { Types } from "mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Readable } from "node:stream";

function getBucket() {
    const db = mongoose.connection.db;

    if (!db) {
        throw new Error("MongoDB is not connected");
    }

    return new GridFSBucket(db, {
        bucketName: "kycFiles",
    });
}

export type StoredGridFile = {
    fileId: Types.ObjectId;
    name: string;
    type: string;
    size: number;
};

export async function uploadBufferToGridFS(params: {
    buffer: Buffer;
    filename: string;
    contentType: string;
}): Promise<StoredGridFile> {
    const bucket = getBucket();

    const uploadStream = bucket.openUploadStream(params.filename, {
        metadata: {
            contentType: params.contentType,
        },
    });

    return new Promise((resolve, reject) => {
        Readable.from(params.buffer) //แปลง Buffer เป็น readable stream
            .pipe(uploadStream) //ส่งข้อมูลจาก buffer เข้า GridFS upload stream
            .on("error", reject) //ถ้า upload error ให้ Promise reject
            .on("finish", () => { //ถ้า upload เสร็จ ให้ resolve ค่า metadata
                resolve({
                    fileId: new Types.ObjectId(uploadStream.id.toString()),
                    name: params.filename,
                    type: params.contentType,
                    size: params.buffer.length,
                });
            });
    });
}

export function openDownloadStream(fileId: string) { //ใช้ตอน download ไฟล์
    const bucket = getBucket();

    if (!ObjectId.isValid(fileId)) {
        throw new Error("Invalid file id");
    }

    return bucket.openDownloadStream(new ObjectId(fileId));
}

export async function findGridFile(fileId: string) {
    const bucket = getBucket();

    if (!ObjectId.isValid(fileId)) {
        throw new Error("Invalid file id");
    }

    const files = await bucket
        .find({
            _id: new ObjectId(fileId),
        })
        .toArray();

    return files[0] ?? null;
}

/* Upload */
/*
multer รับไฟล์จาก frontend
-> ได้ file.buffer
-> uploadBufferToGridFS(file.buffer)
-> GridFS เก็บไฟล์
-> คืน fileId/name/type/size
-> forms.controller เอา metadata ไปเก็บใน FormModel
*/

/* Download */
/*
frontend ขอไฟล์
-> forms.controller หา form
-> เช็คว่า form เป็นของ user นี้ไหม
-> เอา fileId ไป findGridFile()
-> set headers
-> openDownloadStream(fileId)
-> stream.pipe(res)
*/

/* gridfs */
/*
gridfs.service.ts
= ชั้นจัดการไฟล์กับ MongoDB GridFS
= upload buffer -> GridFS
= fileId -> download stream
= fileId -> metadata
*/