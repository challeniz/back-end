import { Injectable } from "@nestjs/common";
import { MulterOptionsFactory } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as path from "path";
import * as fs from 'fs';
import * as multer from "multer";

@Injectable()
export class MulterPostConfig implements MulterOptionsFactory {
    dirPath: string;

    
    constructor() {
        this.dirPath = path.join(process.cwd(), 'uploads/post');
        //this.mkdir();
    }

    mkdir() {
        try {
            fs.readFileSync(this.dirPath);
        } catch (err) {
            fs.mkdirSync(this.dirPath);
        }
    }
    

    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
        const dirPath = this.dirPath;
        const option = {
            storage: multer.diskStorage({
                destination(req, file, res) {
                    res(null, dirPath);
                },

                filename(req, file, res) {
                    const ext = path.extname(file.originalname);
                    const name = path.basename(file.originalname, ext);
                    res(null, `${name}_${Date.now()}${ext}`);
                }
            })
        };
        
        return option;
    }

}