'use server';

import { createClientSession } from "@/server/clients";
import { appwritecfg } from "@/config/appwrite.config";
import { ID } from "node-appwrite";
import { withRetry } from "@/config/helpers/retry.helpers";

/**
 * Upload a file to Appwrite Storage
 * Returns the file ID and the view URL
 */
export const uploadFileAction = async (formData: FormData) => {
    try {
        const { storage } = await createClientSession();
        const file = formData.get('file') as File;
        const bucketId = formData.get('bucketId') as string || appwritecfg.storage.userDocuments;

        if (!file) {
            throw new Error("No file provided");
        }

        const uploadedFile = await withRetry(
            () => storage.createFile({
                bucketId,
                fileId: ID.unique(),
                file
            }),
            3,
            2000,
            "Upload File"
        );

        // Construct the view URL
        // Endpoint: [endpoint]/storage/buckets/[bucketId]/files/[fileId]/view?project=[projectId]
        const viewUrl = `${appwritecfg.project.endpoint}/storage/buckets/${bucketId}/files/${uploadedFile.$id}/view?project=${appwritecfg.project.id}`;

        return {
            success: true,
            fileId: uploadedFile.$id,
            url: viewUrl
        };
    } catch (error: any) {
        console.error("Upload File Error:", error);
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * Delete a file from Appwrite Storage
 */
export const deleteFileAction = async (fileId: string, bucketId: string = appwritecfg.storage.userDocuments) => {
    try {
        const { storage } = await createClientSession();
        await withRetry(
            () => storage.deleteFile(bucketId, fileId),
            3,
            2000,
            "Delete File"
        );
        return { success: true };
    } catch (error: any) {
        console.error("Delete File Error:", error);
        return { success: false, message: error.message };
    }
}
