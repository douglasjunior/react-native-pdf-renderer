import { app } from './dist/index';
import { container } from './dist/shared/container/Container';
import { IUserRepository } from './dist/domain/repositories/IUserRepository';
import { CreateUserUseCase } from './dist/application/use-cases/CreateUserUseCase';
import { UploadFileUseCase } from './dist/application/use-cases/UploadFileUseCase';

/**
 * Example usage of the backend architecture
 */
async function example() {
  console.log('🚀 Backend Architecture Example');
  console.log('================================');

  // The application automatically configures the DI container
  await app.start();

  console.log('\n📝 Creating a user...');
  
  // Get the use case from the container
  const createUserUseCase = container.resolve<CreateUserUseCase>('CreateUserUseCase');
  
  // Create a user
  const user = await createUserUseCase.execute({
    id: 'user-' + Date.now(),
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  console.log('✅ User created:', user.toPlainObject());

  console.log('\n📂 Uploading a file...');
  
  // Get the file upload use case
  const uploadFileUseCase = container.resolve<UploadFileUseCase>('UploadFileUseCase');
  
  // Create a sample file buffer
  const fileContent = Buffer.from('This is a sample text file content');
  
  // Upload the file
  const file = await uploadFileUseCase.execute({
    file: fileContent,
    originalName: 'sample.txt',
    mimeType: 'text/plain',
    uploadedBy: user.id
  });

  console.log('✅ File uploaded:', file.toPlainObject());

  console.log('\n🔍 Retrieving user data...');
  
  // Get user repository directly (for demonstration)
  const userRepository = container.resolve<IUserRepository>('UserRepository');
  const retrievedUser = await userRepository.findById(user.id);
  
  console.log('✅ User retrieved:', retrievedUser?.toPlainObject());

  console.log('\n📋 Listing all users...');
  
  // Get all users
  const allUsers = await userRepository.findAll();
  console.log('✅ All users:', allUsers.map(u => u.toPlainObject()));

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
}

// Run the example
example().catch(console.error);