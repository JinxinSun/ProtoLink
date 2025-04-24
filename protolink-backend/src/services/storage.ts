import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * 存储服务 - 处理文件保存和目录结构维护
 */
class StorageService {
  private baseDir: string;

  constructor(baseUploadDir: string = 'uploads') {
    this.baseDir = path.resolve(process.cwd(), baseUploadDir);
    this.ensureDirectory(this.baseDir);
  }

  /**
   * 保存上传的原型文件，并维护目录结构
   * @param files 上传的文件数组
   * @param prototypeName 原型名称
   * @returns 保存结果，包含ID和路径
   */
  async savePrototype(files: Express.Multer.File[], prototypeName: string): Promise<{ id: string, path: string }> {
    // 生成唯一ID
    const prototypeId = uuidv4();
    
    // 创建原型目录
    const prototypePath = path.join(this.baseDir, prototypeId);
    await this.ensureDirectory(prototypePath);
    
    // 处理每个文件，保持原始目录结构
    for (const file of files) {
      try {
        // 获取原始文件相对路径，确保正确解码和处理文件名编码
        const originalPathWithEncoding = file.originalname;
        let relativePath;

        try {
          // 尝试解码可能被编码的路径
          relativePath = decodeURIComponent(originalPathWithEncoding);
        } catch (e) {
          // 如果解码失败，使用原始路径
          relativePath = originalPathWithEncoding;
          console.warn(`无法解码文件路径: ${originalPathWithEncoding}`);
        }

        // 构建目标文件完整路径 - 处理完整的文件路径（包括子目录）
        const targetPath = path.join(prototypePath, relativePath);
        
        // 确保目标文件的目录存在
        const targetDir = path.dirname(targetPath);
        await this.ensureDirectory(targetDir);
        
        // 写入文件
        await fs.promises.writeFile(targetPath, file.buffer);
        console.log(`成功保存文件: ${relativePath}`);
      } catch (error) {
        console.error(`处理文件 ${file.originalname} 失败:`, error);
        throw error;
      }
    }
    
    return {
      id: prototypeId,
      path: prototypePath
    };
  }

  /**
   * 获取原型文件路径
   * @param prototypeId 原型ID
   * @returns 原型文件路径
   */
  getPrototypePath(prototypeId: string): string {
    return path.join(this.baseDir, prototypeId);
  }

  /**
   * 删除原型文件
   * @param prototypeId 原型ID
   * @returns 删除是否成功
   */
  async deletePrototype(prototypeId: string): Promise<boolean> {
    const prototypePath = this.getPrototypePath(prototypeId);
    
    try {
      // 检查目录是否存在
      await fs.promises.access(prototypePath);
      
      // 递归删除目录
      await this.removeDirectory(prototypePath);
      return true;
    } catch (error) {
      console.error('删除原型文件失败:', error);
      return false;
    }
  }

  /**
   * 确保目录存在，如果不存在则创建
   * @param directory 目录路径
   */
  private async ensureDirectory(directory: string): Promise<void> {
    try {
      await fs.promises.access(directory);
    } catch (error) {
      // 递归创建目录
      await fs.promises.mkdir(directory, { recursive: true });
    }
  }

  /**
   * 递归删除目录
   * @param directory 目录路径
   */
  private async removeDirectory(directory: string): Promise<void> {
    await fs.promises.rm(directory, { recursive: true, force: true });
  }
}

export default StorageService; 