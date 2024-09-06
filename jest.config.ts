import type { Config } from "@jest/types"

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transform: {
        "^.+\\.ts$": "ts-jest",
        "^.+\\.tsx$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
}

export default config
