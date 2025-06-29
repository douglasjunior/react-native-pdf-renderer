require 'json'

packageJson = JSON.parse(File.read('package.json'))
version = packageJson["version"]
repository = packageJson["repository"]["url"]

Pod::Spec.new do |s|
	s.name           = "ReactNativePdfRenderer"
	s.version        = version
	s.description    = packageJson["description"]
	s.homepage       = packageJson["homepage"]
	s.summary        = packageJson["description"]
	s.license        = packageJson["license"]
	s.authors        = packageJson["author"]
	s.source         = { :git => repository, :tag => version }
	s.platform       = :ios, "11.0"
	s.preserve_paths = 'README.md', 'package.json', '*.js'
	s.source_files   = 'ios/ReactNativePdfRendererLibrary/**/*.{h,m,mm,swift}'

	s.frameworks     = 'PDFKit'
	
	install_modules_dependencies(s)
end
