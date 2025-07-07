"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./dist/index");
var Container_1 = require("./dist/shared/container/Container");
/**
 * Example usage of the backend architecture
 */
function example() {
    return __awaiter(this, void 0, void 0, function () {
        var createUserUseCase, user, uploadFileUseCase, fileContent, file, userRepository, retrievedUser, allUsers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Backend Architecture Example');
                    console.log('================================');
                    // The application automatically configures the DI container
                    return [4 /*yield*/, index_1.app.start()];
                case 1:
                    // The application automatically configures the DI container
                    _a.sent();
                    console.log('\n📝 Creating a user...');
                    createUserUseCase = Container_1.container.resolve('CreateUserUseCase');
                    return [4 /*yield*/, createUserUseCase.execute({
                            id: 'user-' + Date.now(),
                            name: 'John Doe',
                            email: 'john.doe@example.com'
                        })];
                case 2:
                    user = _a.sent();
                    console.log('✅ User created:', user.toPlainObject());
                    console.log('\n📂 Uploading a file...');
                    uploadFileUseCase = Container_1.container.resolve('UploadFileUseCase');
                    fileContent = Buffer.from('This is a sample text file content');
                    return [4 /*yield*/, uploadFileUseCase.execute({
                            file: fileContent,
                            originalName: 'sample.txt',
                            mimeType: 'text/plain',
                            uploadedBy: user.id
                        })];
                case 3:
                    file = _a.sent();
                    console.log('✅ File uploaded:', file.toPlainObject());
                    console.log('\n🔍 Retrieving user data...');
                    userRepository = Container_1.container.resolve('UserRepository');
                    return [4 /*yield*/, userRepository.findById(user.id)];
                case 4:
                    retrievedUser = _a.sent();
                    console.log('✅ User retrieved:', retrievedUser === null || retrievedUser === void 0 ? void 0 : retrievedUser.toPlainObject());
                    console.log('\n📋 Listing all users...');
                    return [4 /*yield*/, userRepository.findAll()];
                case 5:
                    allUsers = _a.sent();
                    console.log('✅ All users:', allUsers.map(function (u) { return u.toPlainObject(); }));
                    console.log('\n🎯 Architecture Benefits Demonstrated:');
                    console.log('- ✅ Clean separation of concerns');
                    console.log('- ✅ Dependency injection working');
                    console.log('- ✅ Repository pattern implemented');
                    console.log('- ✅ Use cases encapsulating business logic');
                    console.log('- ✅ File storage with uploads directory');
                    console.log('- ✅ Domain entities with business methods');
                    console.log('- ✅ SOLID principles followed');
                    console.log('- ✅ DDD patterns applied');
                    console.log('\n📁 Files are stored in: uploads/user-uploads/');
                    console.log('🔧 All dependencies are resolved through the container');
                    console.log('🏗️ Architecture is ready for extension and testing');
                    return [2 /*return*/];
            }
        });
    });
}
// Run the example
example().catch(console.error);
