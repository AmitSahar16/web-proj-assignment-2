"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSwagger = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const configSwagger = (app, port) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Web Project API Assignment 2',
                version: '1.0.0',
                description: 'REST API with JWT authentication, CRUD operations for Users, Posts, and Comments',
            },
            servers: [{ url: `http://localhost:${port}` }],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
    };
    const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.configSwagger = configSwagger;
//# sourceMappingURL=swagger.js.map