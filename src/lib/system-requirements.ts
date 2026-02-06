export const OS_OPTIONS = ["Windows 10 64-bit", "Windows 11 64-bit", "MacOS 12+", "Linux (Ubuntu 22.04)"] as const;
export const PROCESSOR_OPTIONS = [
    "Intel Core i5-9600K / AMD Ryzen 5 3600",
    "Intel Core i7-10700K / AMD Ryzen 7 5800X",
    "Intel Core i9-12900K / AMD Ryzen 9 5950X",
    "Apple M1",
    "Apple M2",
] as const;
export const MEMORY_OPTIONS = ["8 GB RAM", "16 GB RAM", "32 GB RAM", "64 GB RAM"] as const;
export const GRAPHICS_OPTIONS = [
    "NVIDIA GeForce GTX 1060 6GB / AMD Radeon RX 580 8GB",
    "NVIDIA GeForce RTX 2060 Super / AMD Radeon RX 5700 XT",
    "NVIDIA GeForce RTX 3080 / AMD Radeon RX 6800 XT",
    "NVIDIA GeForce RTX 4090 / AMD Radeon RX 7900 XTX",
] as const;
export const STORAGE_OPTIONS = ["50 GB available space", "100 GB available space", "150 GB available space", "200 GB available space", "SSD Required"] as const;

export type OsOption = typeof OS_OPTIONS[number];
export type ProcessorOption = typeof PROCESSOR_OPTIONS[number];
export type MemoryOption = typeof MEMORY_OPTIONS[number];
export type GraphicsOption = typeof GRAPHICS_OPTIONS[number];
export type StorageOption = typeof STORAGE_OPTIONS[number];
