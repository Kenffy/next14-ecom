'use server'
import path from "path";
import fs from 'fs/promises';
import { getCurrentUser } from "@/features/auth-page/helpers";

export const UpdateAppSettings = async(settings: any) => {
    try {
        const currentUser = await getCurrentUser();
        if(currentUser && currentUser.isAdmin){
            const filePath = path.join(process.cwd(), 'app.settings.json');
            await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf8');
            return {status: "OK", message: "settings successfully updated."}
        }else{
            return {status: "UNAUTHORIZED", error: "You are not allow to proceed this task."}
        } 
    } catch (error) {
        console.log(error);
    }
}

export const GetAppSettings = async() => {
    try {
        const filePath = path.join(process.cwd(), 'app.settings.json');
        const settings = await fs.readFile(filePath, 'utf8');
        return JSON.parse(settings);
    } catch (error) {
        console.log(error);
    }
}