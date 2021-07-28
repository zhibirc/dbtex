export interface Encryptor {
    encrypt(data: string): string,
    decrypt(data: string): string
}
